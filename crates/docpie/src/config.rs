use std::{env, net::Ipv4Addr, time::Duration};
use tokio::runtime;

pub struct Server {
    pub handle: runtime::Handle,
    pub env: ServerEnv,
}

pub struct ServerEnv {
    pub host: String,
    pub port: u16,
    pub timeout: Duration,
    pub body_timeout: Duration,
}

impl Server {
    pub fn new(handle: runtime::Handle) -> Self {
        Self {
            handle: handle,
            env: ServerEnv::default(),
        }
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
}

impl Default for ServerEnv {
    fn default() -> Self {
        Self {
            host: Self::host(),
            port: Self::port(),
            timeout: Self::timeout(),
            body_timeout: Self::body_timeout(),
        }
    }
}
