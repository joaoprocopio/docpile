use crate::org::{models, services};
use crate::server::state::Server;
use axum::{Json, extract::State};

pub async fn list_orgs_v1(State(server): State<Server>) -> Json<Vec<models::Org>> {
    let orgs = services::list_orgs(&server.db).await.unwrap();

    Json(orgs)
}
