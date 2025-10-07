use crate::{
    auth::{schemas::SignUp, services::create_user, sessions::AuthSession},
    ext::validator::Valid,
    server::state::Server,
};
use axum::{Json, extract::State};

pub async fn sign_in_v1(session: AuthSession, State(server): State<Server>) -> &'static str {
    dbg!(session);
    dbg!(server);

    "sign_in"
}

pub async fn sign_up_v1(
    State(server): State<Server>,
    Valid(Json(sign_up)): Valid<Json<SignUp>>,
) -> &'static str {
    let user = create_user(
        &server,
        sign_up.email,
        sign_up.password,
        sign_up.first_name,
        sign_up.last_name,
    )
    .await;

    dbg!(&user);

    "sign_up"
}

pub async fn sign_out_v1() -> &'static str {
    "sign_out"
}
