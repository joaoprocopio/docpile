use crate::{
    Result,
    db::{DbPool, create_db_pool},
};
use std::{env, net::Ipv4Addr, ops::Deref, sync::Arc, time::Duration};
use tokio::runtime;

#[derive(Clone)]
pub struct State(Arc<StateInner>);

impl Deref for State {
    type Target = Arc<StateInner>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Debug)]
pub struct StateInner {
    pub handle: runtime::Handle,
    pub db: DbPool,
    pub env: StateEnv,
}

#[derive(Debug)]
pub struct StateEnv {
    pub host: String,
    pub port: u16,
    pub timeout: Duration,
    pub body_timeout: Duration,
    pub db_url: String,
}

impl State {
    pub async fn new(handle: runtime::Handle) -> Result<Self> {
        let env = StateEnv::from_env_or_default();
        let db = create_db_pool(&env).await?;

        Ok(Self(Arc::new(StateInner { handle, db, env })))
    }
}

impl StateEnv {
    fn from_env_or_default() -> Self {
        Self {
            host: { env::var("DOCPIE_HOST").unwrap_or(Ipv4Addr::UNSPECIFIED.to_string()) },
            port: {
                const DEFAULT_PORT: u16 = 8000;
                env::var("DOCPIE_PORT")
                    .unwrap_or(DEFAULT_PORT.to_string())
                    .parse()
                    .unwrap_or(DEFAULT_PORT)
            },
            timeout: {
                const DEFAULT_TIMEOUT: u64 = 30;

                Duration::from_secs(
                    env::var("DOCPIE_TIMEOUT")
                        .unwrap_or(DEFAULT_TIMEOUT.to_string())
                        .parse()
                        .unwrap_or(DEFAULT_TIMEOUT),
                )
            },
            body_timeout: {
                const DEFAULT_BODY_TIMEOUT: u64 = 5;
                Duration::from_secs(
                    env::var("DOCPIE_BODY_TIMEOUT")
                        .unwrap_or(DEFAULT_BODY_TIMEOUT.to_string())
                        .parse()
                        .unwrap_or(DEFAULT_BODY_TIMEOUT),
                )
            },
            db_url: { env::var("DOCPIE_DB_URL").unwrap_or("sqlite::memory:".to_string()) },
        }
    }
}
