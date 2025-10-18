use crate::www::config::Server;
use axum::{Router, body::Body, response::Response, routing};

pub fn router() -> Router<Server> {
    Router::new().fallback(routing::any(proxy))
}

async fn proxy() -> Response {
    Response::new(Body::empty())
}
