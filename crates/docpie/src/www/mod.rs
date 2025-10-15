#[path = "config.rs"]
mod _config;
pub mod handlers;
mod router;
pub use router::router;

pub mod config {
    pub use super::_config::Server;
}
