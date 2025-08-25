use std::{env, ops::Deref, sync::Arc};
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
}

impl Default for ServerImplEnv {
    fn default() -> Self {
        Self {
            host: Self::host(),
            port: Self::port(),
        }
    }
}
