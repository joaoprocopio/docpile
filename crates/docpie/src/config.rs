use crate::{
    Result,
    db::{DbPool, create_db_pool},
};
use std::{env, net::Ipv4Addr, time::Duration};
use tokio::runtime;

pub struct Server {
    pub handle: runtime::Handle,
    pub db: DbPool,
    pub env: ServerEnv,
}

pub struct ServerEnv {
    pub host: String,
    pub port: u16,
    pub timeout: Duration,
    pub body_timeout: Duration,
    pub db_url: String,
}

impl Server {
    pub async fn new(handle: runtime::Handle) -> Result<Self> {
        let env = ServerEnv::from_env_or_default();
        let db = create_db_pool(&env).await?;

        Ok(Self { handle, db, env })
    }
}

impl ServerEnv {
    fn host() -> String {
        env::var("DOCPIE_HOST").unwrap_or(Ipv4Addr::UNSPECIFIED.to_string())
    }

    fn port() -> u16 {
        const DEFAULT_PORT: u16 = 8000;

        env::var("DOCPIE_PORT")
            .unwrap_or(DEFAULT_PORT.to_string())
            .parse()
            .unwrap_or(DEFAULT_PORT)
    }

    fn timeout() -> Duration {
        const DEFAULT_TIMEOUT: u64 = 30;

        Duration::from_secs(
            env::var("DOCPIE_TIMEOUT")
                .unwrap_or(DEFAULT_TIMEOUT.to_string())
                .parse()
                .unwrap_or(DEFAULT_TIMEOUT),
        )
    }

    fn body_timeout() -> Duration {
        const DEFAULT_BODY_TIMEOUT: u64 = 5;

        Duration::from_secs(
            env::var("DOCPIE_BODY_TIMEOUT")
                .unwrap_or(DEFAULT_BODY_TIMEOUT.to_string())
                .parse()
                .unwrap_or(DEFAULT_BODY_TIMEOUT),
        )
    }

    fn db_url() -> String {
        env::var("DOCPIE_DB_URL").unwrap_or("sqlite::memory:".to_string())
    }
}

impl ServerEnv {
    fn from_env_or_default() -> Self {
        Self {
            host: Self::host(),
            port: Self::port(),
            timeout: Self::timeout(),
            body_timeout: Self::body_timeout(),
            db_url: Self::db_url(),
        }
    }
}
