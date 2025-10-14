use crate::{
    auth::{
        self,
        layer::{AuthProtectionLayer, new_session_manager_layer},
    },
    error::{AnyJson, Error, ErrorKind, Result},
    org,
    server::state::Server,
};
use anyhow::anyhow;
use axum::{
    Router,
    http::{Method, StatusCode, header},
    middleware::from_fn,
    response::IntoResponse,
    routing,
};
use axum_login::{AuthManagerLayer, AuthManagerLayerBuilder};
use tower::{
    ServiceBuilder,
    layer::util::{Identity, Stack},
};
use tower_http::{
    CompressionLevel,
    catch_panic::{CatchPanicLayer, DefaultResponseForPanic},
    classify::{ServerErrorsAsFailures, SharedClassifier},
    compression::CompressionLayer,
    cors::{AllowHeaders, AllowMethods, AllowOrigin, CorsLayer},
    timeout::{RequestBodyTimeoutLayer, TimeoutLayer},
    trace::TraceLayer,
};
use tower_sessions_sqlx_store::PostgresStore;

pub type Middleware = ServiceBuilder<
    Stack<
        AuthProtectionLayer,
        Stack<
            AuthManagerLayer<Server, PostgresStore>,
            Stack<
                RequestBodyTimeoutLayer,
                Stack<
                    CompressionLayer,
                    Stack<
                        CorsLayer,
                        Stack<
                            TimeoutLayer,
                            Stack<
                                CatchPanicLayer<DefaultResponseForPanic>,
                                Stack<
                                    TraceLayer<SharedClassifier<ServerErrorsAsFailures>>,
                                    Identity,
                                >,
                            >,
                        >,
                    >,
                >,
            >,
        >,
    >,
>;

pub async fn new_middleware(server: &Server) -> Result<Middleware> {
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
        )
        .layer(AuthProtectionLayer::new());

    Ok(middleware)
}

pub fn new_router(middleware: Middleware) -> Router<Server> {
    Router::new()
        .route(
            "/api/v1/auth/whoami",
            routing::get(auth::handlers::whoami).layer(from_fn(auth::unprotected)),
        )
        .route(
            "/api/v1/auth/signin",
            routing::post(auth::handlers::sign_in).layer(from_fn(auth::unprotected)),
        )
        .route(
            "/api/v1/auth/signup",
            routing::post(auth::handlers::sign_up).layer(from_fn(auth::unprotected)),
        )
        .route(
            "/api/v1/auth/signout",
            routing::post(auth::handlers::sign_out),
        )
        .route("/api/v1/orgs", routing::get(org::handlers::list_orgs))
        .layer(middleware)
        .fallback(async || {
            Error::<AnyJson>::from_status(
                StatusCode::NOT_FOUND,
                ErrorKind::Unspecified,
                anyhow!("Route not found"),
            )
            .into_response()
        })
}
