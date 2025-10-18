#[path = "config.rs"]
mod _config;
mod router;
pub use router::router;

pub mod config {
    pub use super::_config::Server;
}
