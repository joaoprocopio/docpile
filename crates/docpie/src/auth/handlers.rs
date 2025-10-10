use crate::{
    auth::{
        schemas::{SafeUser, SignIn, SignUp},
        services::{check_email_taken, create_user},
        sessions::AuthSession,
    },
    error::{Error, ErrorKind, Result, anyerror},
    ext::validator::Valid,
    server::state::Server,
};
use axum::{Json, extract::State, http::StatusCode};

pub async fn sign_in(
    mut auth_session: AuthSession,
    Valid(Json(sign_in)): Valid<Json<SignIn>>,
) -> Result<Json<SafeUser>, Error> {
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
    State(server): State<Server>,
    Valid(Json(sign_up)): Valid<Json<SignUp>>,
) -> Result<(StatusCode, Json<SafeUser>), Error> {
    let is_taken = check_email_taken(&server, &sign_up.email)
        .await
        .map_err(|e| {
            Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e)
        })?;

    if is_taken {
        const DETAIL: &str = "This email is already taken";

        return Err(Error::from_status(
            StatusCode::CONFLICT,
            ErrorKind::EmailIsAlreadyTaken,
            anyerror!(DETAIL),
        )
        .with_details(Some(DETAIL)));
    }

    let user = create_user(
        &server,
        &sign_up.email,
        &sign_up.password,
        &sign_up.display_name,
    )
    .await
    .map_err(|e| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e))?;

    Ok((StatusCode::CREATED, Json(user.into())))
}
