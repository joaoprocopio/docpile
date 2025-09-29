use crate::auth;
use crate::server::config::Server;
use axum::{Router, http::StatusCode, routing::get};
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
        .layer(TraceLayer::new_for_http())
        .layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
        .layer(TimeoutLayer::new(server.env.timeout))
        .layer(RequestBodyTimeoutLayer::new(server.env.body_timeout))
        .layer(CatchPanicLayer::new())
        .layer(CorsLayer::new())
        .route("/api/v1/auth/signin", get(auth::routes::sign_in))
        .fallback(async || StatusCode::NOT_FOUND)
}
