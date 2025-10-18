use axum::{body::Body, response::Response};

pub async fn proxy() -> Response {
    Response::new(Body::empty())
}
