use crate::www::handlers;
use axum::{Router, routing};

pub fn new_www_router() -> Router<()> {
    Router::new()
        .route("/", routing::any(handlers::spa))
        .route("/{*any}", routing::any(handlers::spa))
}
