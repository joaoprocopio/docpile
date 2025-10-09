use crate::{
    auth::{
        schemas::{SafeUser, SignIn, SignUp},
        services::{check_email_taken, create_user},
        sessions::AuthSession,
    },
    ext::validator::Valid,
    server::state::Server,
};
use axum::{Json, extract::State, http::StatusCode};

pub async fn sign_in(
    mut auth_session: AuthSession,
    Valid(Json(sign_in)): Valid<Json<SignIn>>,
) -> Json<SafeUser> {
    // TODO: remove unwrap
    let user = auth_session.authenticate(sign_in).await.unwrap().unwrap();

    // TODO: remove unwrap
    auth_session.login(&user).await.unwrap();

    Json(user.into())
}

pub async fn sign_out(mut auth_session: AuthSession) {
    // TODO: remove unwrap
    auth_session.logout().await.unwrap().unwrap();
}

pub async fn sign_up(
    State(server): State<Server>,
    Valid(Json(sign_up)): Valid<Json<SignUp>>,
) -> (StatusCode, Json<SafeUser>) {
    // TODO: remove unwrap
    check_email_taken(&server, &sign_up.email).await.unwrap();

    let user = create_user(
        &server,
        &sign_up.email,
        &sign_up.password,
        &sign_up.display_name,
    )
    .await
    // TODO: remove unwrap
    .unwrap();

    (StatusCode::CREATED, Json(user.into()))
}
