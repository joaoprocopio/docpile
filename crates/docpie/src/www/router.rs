use crate::www::{config::Server, handlers};
use axum::{Router, routing};

pub fn router() -> Router<Server> {
    Router::new()
        .route("/", routing::any(handlers::spa))
        .route("/{*any}", routing::any(handlers::spa))
}
