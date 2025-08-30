use crate::config::Server;
use axum::{Router, http::StatusCode, response::IntoResponse};
use std::sync::Arc;
use tower_http::CompressionLevel;
use tower_http::catch_panic::CatchPanicLayer;
use tower_http::compression::CompressionLayer;
use tower_http::cors::CorsLayer;
use tower_http::timeout::{RequestBodyTimeoutLayer, TimeoutLayer};
use tower_http::trace::TraceLayer;

pub fn new_router(server: &Server) -> Router<Arc<Server>> {
    Router::new()
        .layer(TraceLayer::new_for_http())
        .layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
        .layer(TimeoutLayer::new(server.env.timeout))
        .layer(RequestBodyTimeoutLayer::new(server.env.body_timeout))
        .layer(CatchPanicLayer::new())
        .layer(CorsLayer::new())
        .fallback(async || StatusCode::NOT_FOUND.into_response())
}
