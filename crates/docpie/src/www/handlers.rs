#[cfg(feature = "dev")]
#[path = "handlers_dev.rs"]
mod handlers;

#[cfg(feature = "prod")]
#[path = "handlers_prod.rs"]
mod handlers;

pub use handlers::*;
