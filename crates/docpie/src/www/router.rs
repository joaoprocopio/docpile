use crate::www::{config::Server, handlers};
use axum::{Router, routing};

pub fn router() -> Router<Server> {
    Router::new().fallback(routing::any(handlers::proxy))
}
