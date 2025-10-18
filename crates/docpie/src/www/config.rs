use crate::{error::Result, ext::env::env_or};
#[cfg(feature = "dev")]
use reqwest::{Client, retry};
#[cfg(feature = "prod")]
use std::{fs::canonicalize, path::PathBuf};
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
    pub addr: String,
    #[cfg(feature = "dev")]
    pub upstream_addr: String,
    #[cfg(feature = "prod")]
    pub upstream_root_dir: PathBuf,
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
            #[cfg(feature = "prod")]
            upstream_root_dir: canonicalize::<String>(env_or("DOCPIE_WWW_UPSTREAM_ROOT_DIR", {
                let mut dir: String = env!("CARGO_MANIFEST_DIR").into();
                dir.push_str("/../../apps/docpie/.output/public");
                dir
            }))?,
        })
    }
}
