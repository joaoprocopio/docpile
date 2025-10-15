use reqwest::Client;
use std::{ops::Deref, sync::Arc};

use crate::{error::Result, ext::env::env_or};

#[derive(Debug, Clone)]
pub struct Server(Arc<ServerInner>);

#[derive(Debug)]
pub struct ServerInner {
    pub client: Client,
    pub env: ServerEnv,
}

#[derive(Debug)]
pub struct ServerEnv {
    pub host: String,
    pub port: u16,
}

impl Server {
    pub fn new() -> Result<Self> {
        let client = Client::builder().build()?;
        let env = ServerEnv::from_env_or_default()?;

        Ok(Self(Arc::new(ServerInner {
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
        })
    }
}
