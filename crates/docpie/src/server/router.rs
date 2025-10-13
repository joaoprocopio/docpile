use crate::{
    auth::{
        self,
        layer::{AuthProtectionLayer, new_session_manager_layer},
    },
    error::Result,
    org,
    server::state::Server,
};
use axum::{
    Router,
    http::{Method, StatusCode, header},
    routing,
};
use axum_login::AuthManagerLayerBuilder;
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
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(CatchPanicLayer::new())
                .layer(TimeoutLayer::new(server.env.timeout))
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
                .layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
                .layer(RequestBodyTimeoutLayer::new(server.env.body_timeout))
                .layer(
                    AuthManagerLayerBuilder::new(
                        server.clone(),
                        new_session_manager_layer(&server).await?,
                    )
                    .build(),
                )
                .layer(AuthProtectionLayer::new()),
        )
        .fallback(async || StatusCode::NOT_FOUND);

    Ok(router)
}
