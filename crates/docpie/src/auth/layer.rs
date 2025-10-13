use crate::{
    error::{Result, anyerror},
    server::state::Server,
};
use axum::http::Request;
use axum_login::tower_sessions::{SessionManagerLayer, session_store::ExpiredDeletion};
use tokio::time::Duration;
use tower::{Layer, Service};
use tower_sessions_sqlx_store::PostgresStore;

#[derive(Clone)]
pub struct AuthProtection<S> {
    inner: S,
}

impl<S, B> Service<Request<B>> for AuthProtection<S>
where
    S: Service<Request<B>>,
{
    type Response = S::Response;
    type Error = S::Error;
    type Future = S::Future;

    fn poll_ready(
        &mut self,
        cx: &mut std::task::Context<'_>,
    ) -> std::task::Poll<std::result::Result<(), Self::Error>> {
        self.inner.poll_ready(cx)
    }

    fn call(&mut self, req: Request<B>) -> Self::Future {
        self.inner.call(req)
    }
}

#[derive(Clone)]
pub struct AuthProtectionLayer;

impl AuthProtectionLayer {
    pub fn new() -> Self {
        Self
    }
}

impl<S> Layer<S> for AuthProtectionLayer {
    type Service = AuthProtection<S>;

    fn layer(&self, inner: S) -> Self::Service {
        Self::Service { inner: inner }
    }
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
