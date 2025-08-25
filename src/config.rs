use std::env;
use tokio::runtime;

#[derive(Clone)]
pub struct Server {
    // handle is sync internally so it's clone cheap
    pub handle: runtime::Handle,
    pub host: String,
    pub port: u16,
}

impl Server {
    pub fn new(handle: runtime::Handle) -> Self {
        Self {
            handle,
            host: Self::host(),
            port: Self::port(),
        }
    }

    pub fn host() -> String {
        env::var("DOCPIE_HOST").unwrap_or("0.0.0.0".into())
    }

    pub fn port() -> u16 {
        const DEFAULT_PORT: u16 = 8000;

        env::var("DOCPIE_PORT")
            .unwrap_or(DEFAULT_PORT.to_string())
            .parse()
            .unwrap_or(DEFAULT_PORT)
    }
}
