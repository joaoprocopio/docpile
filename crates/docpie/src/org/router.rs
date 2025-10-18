use crate::{
    auth,
    error::{Error, ErrorKind, Result},
    http::config::Server,
    org::{schemas::Org, services::list_all_orgs},
};
use axum::{Json, extract::State, routing};
use axum::{Router, http::StatusCode};

pub fn router() -> Router<Server> {
    Router::new().route("/", routing::get(list_orgs).layer(auth::protected!()))
}

async fn list_orgs(State(server): State<Server>) -> Result<Json<Vec<Org>>, Error> {
    let orgs = list_all_orgs(&server).await.map_err(|e| {
        Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e)
    })?;

    Ok(Json(orgs.into_iter().map(|u| u.into()).collect()))
}
