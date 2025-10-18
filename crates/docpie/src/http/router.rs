use crate::{
    auth::{self, layer::new_session_manager_layer},
    error::{AnyJson, Error, ErrorKind, Result, anyerror},
    http::config::Server,
    org,
};
use axum::{
    Router,
    http::{Method, StatusCode, header},
    response::IntoResponse,
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

pub async fn router(server: &Server) -> Result<Router<Server>> {
    let middleware = ServiceBuilder::new()
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
            AuthManagerLayerBuilder::new(server.clone(), new_session_manager_layer(&server).await?)
                .build(),
        );

    Ok(Router::new()
        .nest("/api/v1/auth", auth::router())
        .nest("/api/v1/orgs", org::router())
        .layer(middleware)
        .fallback(async || {
            Error::<AnyJson>::from_status(
                StatusCode::NOT_FOUND,
                ErrorKind::Unspecified,
                anyerror!("Route not found"),
            )
            .into_response()
        }))
}
