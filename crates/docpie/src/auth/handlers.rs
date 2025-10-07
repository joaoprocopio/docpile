use crate::{
    auth::{schemas::SignIn, services::AuthSession},
    ext::validator::Valid,
    server::state::Server,
};
use axum::{Json, extract::State};

pub async fn sign_in_v1(session: AuthSession, State(server): State<Server>) -> &'static str {
    dbg!(session);
    dbg!(server);

    "sign_in"
}

pub async fn sign_up_v1(Valid(Json(body)): Valid<Json<SignIn>>) -> &'static str {
    dbg!(body);

    "sign_up"
}

pub async fn sign_out_v1() -> &'static str {
    "sign_out"
}
