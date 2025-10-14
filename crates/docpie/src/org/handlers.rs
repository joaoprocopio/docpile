use crate::{
    error::{Error, ErrorKind, Result},
    http::config::Server,
    org::{schemas::Org, services::list_all_orgs},
};
use axum::http::StatusCode;
use axum::{Json, extract::State};

pub async fn list_orgs(State(server): State<Server>) -> Result<Json<Vec<Org>>, Error> {
    let orgs = list_all_orgs(&server).await.map_err(|e| {
        Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e)
    })?;

    Ok(Json(orgs.into_iter().map(|u| u.into()).collect()))
}
