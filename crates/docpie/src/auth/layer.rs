use std::pin::Pin;

use crate::{
    auth::sessions::AuthSession,
    error::{AnyJson, Error, ErrorKind, Result, anyerror},
    server::state::Server,
};
use axum::{
    extract::Request,
    http::StatusCode,
    middleware::{FromFnLayer, Next, from_fn},
    response::{IntoResponse, Response},
};
use axum_login::tower_sessions::{SessionManagerLayer, session_store::ExpiredDeletion};
use tokio::time::Duration;
use tower_sessions_sqlx_store::PostgresStore;

async fn protected_impl(session: AuthSession, req: Request, next: Next) -> Response {
    if session.user.is_some() {
        next.run(req).await
    } else {
        Error::<AnyJson>::from_status(
            StatusCode::UNAUTHORIZED,
            ErrorKind::UnauthorizedRoute,
            anyerror!("This is a protected route"),
        )
        .into_response()
    }
}

pub fn protected() -> FromFnLayer<
    fn(AuthSession, Request, Next) -> Pin<Box<dyn Future<Output = Response> + Send>>,
    (),
    (AuthSession, Request),
> {
    from_fn(|session: AuthSession, req: Request, next: Next| {
        Box::pin(protected_impl(session, req, next))
            as Pin<Box<dyn Future<Output = Response> + Send>>
    })
}

pub async fn new_session_manager_layer(
    server: &Server,
) -> Result<SessionManagerLayer<PostgresStore>> {
    let store = PostgresStore::new(server.db.clone())
        .with_schema_name("public")
        .and_then(|s| s.with_table_name("sessions"))
        .map_err(|e| anyerror!(e))?;

    store.migrate().await?;

    // TODO: handle cancellation
    server.handle.spawn(
        store
            .clone()
            .continuously_delete_expired(Duration::from_secs(60)),
    );

    Ok(SessionManagerLayer::new(store).with_name("sessionid"))
}
