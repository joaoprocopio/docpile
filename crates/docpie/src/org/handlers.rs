use crate::org::{models::Org, services::list_all_orgs};
use crate::problem::Problem;
use crate::server::state::Server;
use axum::http::StatusCode;
use axum::{Json, extract::State};

pub async fn list_orgs(State(server): State<Server>) -> Result<Json<Vec<Org>>, Problem> {
    let orgs = list_all_orgs(&server)
        .await
        .map_err(|_| Problem::from_status(StatusCode::UNPROCESSABLE_ENTITY))?;

    Ok(Json(orgs))
}
