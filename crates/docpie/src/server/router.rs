use crate::{
    auth::{self, middleware::AuthLayerError},
    org,
    server::state::Server,
};
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

#[derive(thiserror::Error, Debug)]
pub enum NewRouterError {
    #[error(transparent)]
    Auth(#[from] AuthLayerError),
}

pub async fn new_router(server: &Server) -> Result<Router<Server>, NewRouterError> {
    let router = Router::new()
        .route("/api/v1/orgs", routing::get(org::handlers::list_orgs))
        .route(
            "/api/v1/auth/signin",
            routing::post(auth::handlers::sign_in),
        )
        .route(
            "/api/v1/auth/signup",
            routing::post(auth::handlers::sign_up),
        )
        .route(
            "/api/v1/auth/signout",
            routing::post(auth::handlers::sign_out),
        )
        .fallback(async || StatusCode::NOT_FOUND)
        .layer(
            ServiceBuilder::new()
                .layer(auth::middleware::new_auth_layer(&server).await?)
                .layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
                .layer(TimeoutLayer::new(server.env.timeout))
                .layer(RequestBodyTimeoutLayer::new(server.env.body_timeout))
                .layer(CorsLayer::new())
                .layer(CatchPanicLayer::new())
                .layer(TraceLayer::new_for_http()),
        );

    Ok(router)
}
