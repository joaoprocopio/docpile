use crate::{error::Result, ext::env::env_or};
#[cfg(feature = "dev")]
use reqwest::{Client, retry};
use std::{ops::Deref, sync::Arc};

#[derive(Debug, Clone)]
pub struct Server(Arc<ServerInner>);

#[derive(Debug)]
pub struct ServerInner {
    pub env: ServerEnv,
    #[cfg(feature = "dev")]
    pub client: Client,
}

#[derive(Debug)]
pub struct ServerEnv {
    pub host: String,
    pub port: u16,
    #[cfg(feature = "dev")]
    pub dev_upstream_host: String,
    #[cfg(feature = "dev")]
    pub dev_upstream_port: u16,
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
            host: env_or("DOCPIE_WWW_HOST", "0.0.0.0".into()),
            port: env_or("DOCPIE_WWW_PORT", 3000),
            #[cfg(feature = "dev")]
            dev_upstream_host: env_or("DOCPIE_WWW_DEV_UPSTREAM_HOST", "localhost".into()),
            #[cfg(feature = "dev")]
            dev_upstream_port: env_or("DOCPIE_WWW_DEV_UPSTREAM_PORT", 5173),
        })
    }
}
