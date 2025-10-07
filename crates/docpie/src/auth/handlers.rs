use crate::{
    auth::{models::User, schemas::SignUp, services::create_user},
    ext::validator::Valid,
    server::state::Server,
};
use axum::{Json, extract::State};

pub async fn sign_in_v1() -> &'static str {
    "sign_in"
}

pub async fn sign_up_v1(
    State(server): State<Server>,
    Valid(Json(sign_up)): Valid<Json<SignUp>>,
) -> Json<User> {
    let user = create_user(
        &server,
        sign_up.email,
        sign_up.password,
        sign_up.first_name,
        sign_up.last_name,
    )
    .await
    // TODO: remove unwrap
    .unwrap();

    Json(user)
}

pub async fn sign_out_v1() -> &'static str {
    "sign_out"
}
