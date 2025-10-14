use crate::{
    error::{Result, anyerror},
    server::state::Server,
};
use axum_login::tower_sessions::{SessionManagerLayer, session_store::ExpiredDeletion};
use tokio::time::Duration;
use tower_sessions_sqlx_store::PostgresStore;

macro_rules! protected {
    () => {{
        use axum::{
            extract::Request,
            middleware::{Next, from_fn},
            response::IntoResponse,
        };
        use $crate::auth::sessions::AuthSession;

        from_fn(
            |session: AuthSession, req: Request, next: Next| async move {
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
            },
        )
    }};
}

pub(crate) use protected;

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
