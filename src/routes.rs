use crate::Server;
use axum::{Router, http::StatusCode, response::IntoResponse};
use tower_http::CompressionLevel;
use tower_http::catch_panic::CatchPanicLayer;
use tower_http::compression::CompressionLayer;
use tower_http::cors::CorsLayer;
use tower_http::timeout::{RequestBodyTimeoutLayer, TimeoutLayer};
use tower_http::trace::TraceLayer;

pub fn routes(server: &Server) -> Router<Server> {
    Router::new()
        .layer(TraceLayer::new_for_http())
        .layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
        .layer(TimeoutLayer::new(server.env.timeout))
        .layer(RequestBodyTimeoutLayer::new(server.env.body_timeout))
        .layer(CatchPanicLayer::new())
        .layer(CorsLayer::new())
        .route(
            "/v1/hello",
            axum::routing::get(|| async { "Hello, World!" }),
        )
        .fallback(async || StatusCode::NOT_FOUND.into_response())
}
