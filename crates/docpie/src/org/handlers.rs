use crate::org::{models::Org, services::list_orgs};
use crate::server::state::Server;
use axum::http::StatusCode;
use axum::{Json, extract::State};
use serde::Serialize;

#[derive(Serialize)]
#[serde(untagged)]
pub enum ListOrgsV1Response {
    Ok(Vec<Org>),
    Err { detail: String },
}

pub async fn list_orgs_v1(State(server): State<Server>) -> (StatusCode, Json<ListOrgsV1Response>) {
    let orgs = list_orgs(&server).await;

    match orgs {
        Ok(orgs) => (StatusCode::OK, Json(ListOrgsV1Response::Ok(orgs))),
        Err(err) => {
            tracing::error!(?err);

            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ListOrgsV1Response::Err {
                    detail: err.to_string(),
                }),
            )
        }
    }
}
