use axum::{body::Body, response::Response};
use tower_http::services::fs::ServeFile;

pub async fn proxy() -> Response {
    Response::new(Body::empty())
}
