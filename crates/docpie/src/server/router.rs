use crate::{auth, error::Result, org, server::state::Server};
use axum::{
    Router,
    http::{Method, StatusCode, header},
    routing,
};
use tower::ServiceBuilder;
use tower_http::{
    CompressionLevel,
    catch_panic::CatchPanicLayer,
    compression::CompressionLayer,
    cors::{AllowHeaders, AllowMethods, AllowOrigin, CorsLayer},
    timeout::{RequestBodyTimeoutLayer, TimeoutLayer},
    trace::TraceLayer,
};

pub async fn new_router(server: &Server) -> Result<Router<Server>> {
    let router = Router::new()
        .route("/api/v1/orgs", routing::get(org::handlers::list_orgs))
        .route("/api/v1/auth/whoami", routing::get(auth::handlers::whoami))
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
                .layer(
                    CorsLayer::new()
                        .allow_headers(AllowHeaders::list([header::CONTENT_TYPE]))
                        .allow_methods(AllowMethods::list([
                            Method::PUT,
                            Method::POST,
                            Method::PATCH,
                            Method::OPTIONS,
                            Method::HEAD,
                            Method::GET,
                            Method::DELETE,
                        ]))
                        .allow_origin(AllowOrigin::list(server.env.allowed_origins.clone()))
                        .allow_credentials(true),
                )
                .layer(CatchPanicLayer::new())
                .layer(TraceLayer::new_for_http()),
        );

    Ok(router)
}
