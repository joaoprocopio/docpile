use crate::Server;
use axum::Router;
use tower_http::trace::TraceLayer;

pub fn routes() -> Router<Server> {
    Router::new().layer(TraceLayer::new_for_http())
}
