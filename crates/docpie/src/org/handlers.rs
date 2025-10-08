use crate::org::{models::Org, services::list_all_orgs};
use crate::server::state::Server;
use axum::{Json, extract::State};

pub async fn list_orgs(State(server): State<Server>) -> Json<Vec<Org>> {
    // TODO: remove unwrap
    let orgs = list_all_orgs(&server).await.unwrap();

    Json(orgs)
}
