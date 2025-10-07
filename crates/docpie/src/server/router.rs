use crate::{auth, org, server::state::Server};
use axum::{Router, http::StatusCode, routing};
// use axum_login::{AuthManagerLayerBuilder, tower_sessions::SessionManagerLayer};
use tower::ServiceBuilder;
use tower_http::{
    CompressionLevel,
    catch_panic::CatchPanicLayer,
    compression::CompressionLayer,
    cors::CorsLayer,
    timeout::{RequestBodyTimeoutLayer, TimeoutLayer},
    trace::TraceLayer,
};
// use tower_sessions_sqlx_store::PostgresStore;

pub fn new_router(server: &Server) -> Router<Server> {
    Router::new()
        .route("/api/v1/orgs", routing::get(org::handlers::list_orgs_v1))
        .route(
            "/api/v1/auth/signin",
            routing::post(auth::handlers::sign_in_v1),
        )
        .route(
            "/api/v1/auth/signup",
            routing::post(auth::handlers::sign_up_v1),
        )
        .route(
            "/api/v1/auth/signout",
            routing::post(auth::handlers::sign_out_v1),
        )
        .fallback(async || StatusCode::NOT_FOUND)
        .layer(
            ServiceBuilder::new()
                // .layer(
                //     AuthManagerLayerBuilder::<Server, PostgresStore>::new(
                //         server.clone(),
                //         SessionManagerLayer::new(PostgresStore::new(server.db.clone())),
                //     )
                //     .build(),
                // )
                .layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
                .layer(TimeoutLayer::new(server.env.timeout))
                .layer(RequestBodyTimeoutLayer::new(server.env.body_timeout))
                .layer(CorsLayer::new())
                .layer(CatchPanicLayer::new())
                .layer(TraceLayer::new_for_http()),
        )
}
