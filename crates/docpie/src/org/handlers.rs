use crate::org::{models::Org, services::list_all_orgs};
use crate::problem::Problem;
use crate::server::state::Server;
use axum::{Json, extract::State};

pub async fn list_orgs(State(server): State<Server>) -> Result<Json<Vec<Org>>, Problem> {
    let orgs = list_all_orgs(&server).await.map_err(|e| {
        Problem::from_status(500, e).with_details("Unknown error occurred while querying")
    })?;

    Ok(Json(orgs))
}
