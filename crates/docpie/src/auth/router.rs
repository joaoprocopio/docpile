use crate::{
    auth::{
        self,
        schemas::{ReadUser, SignIn, SignUp},
        services::{create_user, onboard_user},
        sessions::AuthSession,
    },
    error::{Error, ErrorKind, Result, anyerror},
    ext::validator::Valid,
    http::config::Server,
};
use axum::{Json, Router, extract::State, http::StatusCode, routing};

pub fn router_v1() -> Router<Server> {
    Router::new()
        .route("/whoami", routing::get(whoami_v1))
        .route("/signin", routing::post(sign_in_v1))
        .route("/signup", routing::post(sign_up_v1))
        .route(
            "/signout",
            routing::post(sign_out_v1).layer(auth::protected!()),
        )
        .route(
            "/onboard",
            routing::post(onboard_v1).layer(auth::protected!()),
        )
}

async fn whoami_v1(auth: AuthSession) -> Result<Json<Option<ReadUser>>, Error> {
    match auth.user {
        Some(user) => {
            auth.session.cycle_id().await.map_err(|e| {
                Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e)
            })?;

            Ok(Json(Some(user.into())))
        }
        None => Ok(Json(None)),
    }
}

async fn sign_in_v1(
    mut auth: AuthSession,
    Valid(Json(sign_in)): Valid<Json<SignIn>>,
) -> Result<Json<ReadUser>, Error> {
    let user = auth
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

    auth.login(&user).await.map_err(|e| {
        Error::from_status(StatusCode::UNAUTHORIZED, ErrorKind::InvalidCredentials, e)
    })?;

    Ok(Json(user.into()))
}

async fn sign_out_v1(mut auth: AuthSession) -> Result<(), Error> {
    let _ = auth.logout().await.map_err(|e| {
        Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e)
    })?;

    Ok(())
}

async fn sign_up_v1(
    mut auth: AuthSession,
    State(server): State<Server>,
    Valid(Json(sign_up)): Valid<Json<SignUp>>,
) -> Result<(StatusCode, Json<ReadUser>), Error> {
    let user = create_user(
        &server,
        &sign_up.email,
        &sign_up.password,
        &sign_up.display_name,
    )
    .await
    .map_err(|err| {
        let is_unique_violation = err
            .downcast_ref::<sqlx::Error>()
            .and_then(|err| err.as_database_error())
            .and_then(|err| Some(err.is_unique_violation()))
            .unwrap_or(false);

        if is_unique_violation {
            return Error::from_status(StatusCode::CONFLICT, ErrorKind::EmailIsAlreadyTaken, err);
        }

        Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, err)
    })?;

    auth.login(&user).await.map_err(|e| {
        Error::from_status(StatusCode::UNAUTHORIZED, ErrorKind::InvalidCredentials, e)
    })?;

    Ok((StatusCode::CREATED, Json(user.into())))
}

async fn onboard_v1(
    auth: AuthSession,
    State(server): State<Server>,
) -> Result<Json<ReadUser>, Error> {
    let user = auth.user.expect("This route should be protected");
    let updated_user = onboard_user(&server, user).await.map_err(|err| {
        Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, err)
    })?;

    Ok(Json(updated_user.into()))
}
