use std::{env, ops::Deref, sync::Arc, time::Duration};
use tokio::runtime;

#[derive(Clone)]
pub struct Server {
    inner: Arc<ServerImpl>,
}

pub struct ServerImpl {
    pub handle: runtime::Handle,
    pub env: ServerImplEnv,
}

pub struct ServerImplEnv {
    pub host: String,
    pub port: u16,
    pub timeout: Duration,
    pub body_timeout: Duration,
}

impl Server {
    pub fn new(handle: runtime::Handle) -> Self {
        Self {
            inner: Arc::new(ServerImpl::new(handle)),
        }
    }
}

impl Deref for Server {
    type Target = ServerImpl;

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}

impl ServerImpl {
    fn new(handle: runtime::Handle) -> Self {
        Self {
            handle,
            env: ServerImplEnv::default(),
        }
    }
}

impl ServerImplEnv {
    fn host() -> String {
        env::var("DOCPIE_HOST").unwrap_or("0.0.0.0".into())
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
}

impl Default for ServerImplEnv {
    fn default() -> Self {
        Self {
            host: Self::host(),
            port: Self::port(),
            timeout: Self::timeout(),
            body_timeout: Self::body_timeout(),
        }
    }
}
