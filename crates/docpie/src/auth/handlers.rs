use crate::{auth::services::AuthSession, server::state::Server};
use axum::extract::State;

pub async fn sign_in_v1(session: AuthSession, State(server): State<Server>) -> &'static str {
    dbg!(session);
    dbg!(server);

    "sign_in"
}

pub async fn sign_up_v1() -> &'static str {
    "sign_up"
}

pub async fn sign_out_v1() -> &'static str {
    "sign_out"
}
