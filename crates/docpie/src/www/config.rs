use crate::{error::Result, ext::env::env_or};
use axum::body::Body;
use hyper_util::{
    client::legacy::{Client, connect::HttpConnector},
    rt::TokioExecutor,
};
use std::{ops::Deref, sync::Arc};
use tokio::runtime;

#[derive(Debug, Clone)]
pub struct Server(Arc<ServerInner>);

#[derive(Debug)]
pub struct ServerInner {
    pub client: Client<HttpConnector, Body>,
    pub handle: runtime::Handle,
    pub env: ServerEnv,
}

#[derive(Debug)]
pub struct ServerEnv {
    pub host: String,
    pub port: u16,
    pub dev_upstream_host: String,
    pub dev_upstream_port: u16,
}

impl Server {
    pub fn new(handle: runtime::Handle) -> Result<Self> {
        let client = Client::builder(TokioExecutor::new()).build(HttpConnector::new());
        let env = ServerEnv::from_env_or_default()?;

        Ok(Self(Arc::new(ServerInner {
            handle: handle,
            client: client,
            env: env,
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
            dev_upstream_host: env_or("DOCPIE_WWW_DEV_UPSTREAM_HOST", "localhost".into()),
            dev_upstream_port: env_or("DOCPIE_WWW_DEV_UPSTREAM_PORT", 5173),
        })
    }
}
