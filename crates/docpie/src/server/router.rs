use crate::{auth, org, server::state::Server};
use axum::{Router, http::StatusCode, routing};
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
        .route("/api/v1/orgs", routing::get(org::handlers::list_orgs_v1))
        .route(
            "/api/v1/auth/signin",
            routing::get(auth::handlers::sign_in_v1),
        )
        .route(
            "/api/v1/auth/signup",
            routing::get(auth::handlers::sign_up_v1),
        )
        .route(
            "/api/v1/auth/signout",
            routing::get(auth::handlers::sign_out_v1),
        )
        .fallback(async || StatusCode::NOT_FOUND)
}
