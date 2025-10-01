use crate::server::state::Server;
use axum::{Router, http::StatusCode};
use tower::ServiceBuilder;
use tower_http::{
    CompressionLevel,
    catch_panic::CatchPanicLayer,
    compression::CompressionLayer,
    cors::CorsLayer,
    timeout::{RequestBodyTimeoutLayer, TimeoutLayer},
    trace::TraceLayer,
};

pub fn new_router(server: &Server) -> Router<Server> {
    Router::new()
        .layer(
            ServiceBuilder::new()
                .layer(TimeoutLayer::new(server.env.timeout))
                .layer(RequestBodyTimeoutLayer::new(server.env.body_timeout))
                .layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
                .layer(CorsLayer::new())
                .layer(CatchPanicLayer::new())
                .layer(TraceLayer::new_for_http()),
        )
        .fallback(async || StatusCode::NOT_FOUND)
}
