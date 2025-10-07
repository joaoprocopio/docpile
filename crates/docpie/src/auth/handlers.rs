use crate::{
    auth::{
        models::User,
        schemas::SignUp,
        services::{check_email_taken, create_user},
    },
    ext::validator::Valid,
    server::state::Server,
};
use axum::{Json, extract::State, http::StatusCode};
use serde::Serialize;

pub async fn sign_in_v1() -> &'static str {
    "sign_in"
}

#[derive(Serialize)]
#[serde(untagged)]
pub enum SignUpV1Response {
    MailTaken { r#type: String },
    Success(User),
}

pub async fn sign_up_v1(
    State(server): State<Server>,
    Valid(Json(sign_up)): Valid<Json<SignUp>>,
) -> (StatusCode, Json<SignUpV1Response>) {
    let mail_taken = check_email_taken(&server, sign_up.email).await?;

    if mail_taken {
        return (
            StatusCode::CONFLICT,
            Json(SignUpV1Response::MailTaken {
                r#type: "MAIL_TAKEN".to_owned(),
            }),
        );
    }

    let user = create_user(
        &server,
        sign_up.email,
        sign_up.password,
        sign_up.first_name,
        sign_up.last_name,
    )
    .await?;

    Json(user)
}

pub async fn sign_out_v1() -> &'static str {
    "sign_out"
}
