use crate::org::{models::Org, services::list_orgs};
use crate::server::state::Server;
use axum::{Json, extract::State};

pub async fn list_orgs_v1(State(server): State<Server>) -> Json<Vec<Org>> {
    // TODO: remove unwrap
    let orgs = list_orgs(&server).await.unwrap();

    Json(orgs)
}
