use crate::{error::Result, ext::env::env_or};
#[cfg(feature = "dev")]
use reqwest::{Client, retry};
use std::{ops::Deref, sync::Arc};

#[derive(Debug, Clone)]
pub struct Server(Arc<ServerInner>);

#[derive(Debug)]
pub struct ServerInner {
    // pub crate_root: &'static Path,
    // pub wkspc_root: &'static Path,
    pub env: ServerEnv,
    #[cfg(feature = "dev")]
    pub client: Client,
}

#[derive(Debug)]
pub struct ServerEnv {
    pub addr: String,
    #[cfg(feature = "dev")]
    pub upstream_addr: String,
}

impl Server {
    pub fn new() -> Result<Self> {
        Ok(Self(Arc::new(ServerInner {
            #[cfg(feature = "dev")]
            client: Client::builder().retry(retry::never()).build()?,
            env: ServerEnv::from_env_or_default()?,
        })))
    }
}

impl Deref for Server {
    type Target = Arc<ServerInner>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl ServerEnv {
    fn from_env_or_default() -> Result<Self> {
        Ok(Self {
            addr: env_or("DOCPIE_WWW_ADDR", "0.0.0.0:3000".into()),
            #[cfg(feature = "dev")]
            upstream_addr: env_or("DOCPIE_WWW_UPSTREAM_ADDR", "localhost:5173".into()),
        })
    }
}
