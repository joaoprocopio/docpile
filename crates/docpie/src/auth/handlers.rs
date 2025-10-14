use crate::{
    auth::{
        schemas::{SignIn, SignUp, User},
        services::{check_email_taken, create_user},
        sessions::AuthSession,
    },
    error::{Error, ErrorKind, Result, anyerror},
    ext::validator::Valid,
    http::state::Server,
};
use axum::{Json, extract::State, http::StatusCode};

pub async fn whoami(auth_session: AuthSession) -> Result<Json<Option<User>>, Error> {
    match auth_session.user {
        Some(user) => {
            auth_session.session.cycle_id().await.map_err(|e| {
                Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e)
            })?;

            Ok(Json(Some(user.into())))
        }
        None => Ok(Json(None)),
    }
}

pub async fn sign_in(
    mut auth_session: AuthSession,
    Valid(Json(sign_in)): Valid<Json<SignIn>>,
) -> Result<Json<User>, Error> {
    let user = auth_session
        .authenticate(sign_in)
        .await
        .map_err(|e| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e))?
        .ok_or_else(|| {
            Error::from_status(
                StatusCode::UNAUTHORIZED,
                ErrorKind::InvalidCredentials,
                anyerror!("Couldn't find this user"),
            )
        })?;

    auth_session.login(&user).await.map_err(|e| {
        Error::from_status(StatusCode::UNAUTHORIZED, ErrorKind::InvalidCredentials, e)
    })?;

    Ok(Json(user.into()))
}

pub async fn sign_out(mut auth_session: AuthSession) -> Result<(), Error> {
    let _ = auth_session.logout().await.map_err(|e| {
        Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e)
    })?;

    Ok(())
}

pub async fn sign_up(
    mut auth_session: AuthSession,
    State(server): State<Server>,
    Valid(Json(sign_up)): Valid<Json<SignUp>>,
) -> Result<(StatusCode, Json<User>), Error> {
    let is_taken = check_email_taken(&server, &sign_up.email)
        .await
        .map_err(|e| {
            Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e)
        })?;

    if is_taken {
        const TEXT: &str = "This email is already taken";

        return Err(Error::from_status(
            StatusCode::CONFLICT,
            ErrorKind::EmailIsAlreadyTaken,
            anyerror!(TEXT),
        )
        .with_details(Some(TEXT)));
    }

    let user = create_user(
        &server,
        &sign_up.email,
        &sign_up.password,
        &sign_up.display_name,
    )
    .await
    .map_err(|e| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e))?;

    auth_session.login(&user).await.map_err(|e| {
        Error::from_status(StatusCode::UNAUTHORIZED, ErrorKind::InvalidCredentials, e)
    })?;

    Ok((StatusCode::CREATED, Json(user.into())))
}
