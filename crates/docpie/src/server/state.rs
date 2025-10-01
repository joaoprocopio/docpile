use crate::{
    db::{CreateDBPoolError, DbPool, create_db_pool},
    ext::env::env_or,
};
use std::{ops::Deref, sync::Arc, time::Duration};
use tokio::runtime;

#[derive(Debug, Clone)]
pub struct Server(Arc<ServerInner>);

impl Deref for Server {
    type Target = Arc<ServerInner>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Debug)]
pub struct ServerInner {
    pub handle: runtime::Handle,
    pub db: DbPool,
    pub env: ServerEnv,
}

#[derive(Debug)]
pub struct ServerEnv {
    pub host: String,
    pub port: u16,
    pub timeout: Duration,
    pub body_timeout: Duration,
    pub db_url: String,
}

#[derive(thiserror::Error, Debug)]
pub enum NewServerError {
    #[error(transparent)]
    CreateDBPool(#[from] CreateDBPoolError),
}

impl Server {
    pub async fn new(handle: runtime::Handle) -> Result<Self, NewServerError> {
        let env = ServerEnv::from_env_or_default();
        let db = create_db_pool(&env).await?;

        Ok(Self(Arc::new(ServerInner {
            handle: handle,
            db: db,
            env: env,
        })))
    }
}

impl ServerEnv {
    fn from_env_or_default() -> Self {
        Self {
            host: env_or("DOCPIE_HOST", "0.0.0.0".into()),
            port: env_or("DOCPIE_PORT", 8000),
            db_url: env_or("DOCPIE_DB_URL", "sqlite:./db.sqlite3".into()),
            timeout: Duration::from_secs(env_or("DOCPIE_TIMEOUT", 30)),
            body_timeout: Duration::from_secs(env_or("DOCPIE_BODY_TIMEOUT", 5)),
        }
    }
}
