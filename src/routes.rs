use crate::Server;
use axum::{Router, http::StatusCode, response::IntoResponse};
use tower_http::trace::TraceLayer;

pub fn routes() -> Router<Server> {
    Router::new()
        .layer(TraceLayer::new_for_http())
        .fallback(async || StatusCode::NOT_FOUND.into_response())
}
