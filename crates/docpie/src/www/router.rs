#[cfg(feature = "dev")]
#[path = "router_dev.rs"]
mod router;

#[cfg(feature = "prod")]
#[path = "router_prod.rs"]
mod router;

pub use router::router;
