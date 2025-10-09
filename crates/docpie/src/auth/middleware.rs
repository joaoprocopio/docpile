use crate::server::state::Server;
use axum_login::{
    AuthManagerLayer, AuthManagerLayerBuilder,
    tower_sessions::{SessionManagerLayer, session_store::ExpiredDeletion},
};
use tokio::time::Duration;
use tower_sessions_sqlx_store::PostgresStore;

#[derive(thiserror::Error, Debug)]
pub enum AuthLayerError {
    #[error("{0}")]
    Store(String),

    #[error(transparent)]
    SQLX(#[from] sqlx::Error),
}

pub async fn new_auth_layer(
    server: &Server,
) -> Result<AuthManagerLayer<Server, PostgresStore>, AuthLayerError> {
    let store = PostgresStore::new(server.db.clone())
        .with_schema_name("public")
        .and_then(|s| s.with_table_name("sessions"))
        .map_err(|e| AuthLayerError::Store(e))?;

    store.migrate().await?;

    // TODO: handle cancellation
    server.handle.spawn(
        store
            .clone()
            .continuously_delete_expired(Duration::from_secs(60)),
    );

    let session_manager = SessionManagerLayer::new(store).with_name("sessionid");

    Ok(AuthManagerLayerBuilder::new(server.clone(), session_manager).build())
}
