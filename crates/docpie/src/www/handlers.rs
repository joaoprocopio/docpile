#[cfg(feature = "dev")]
#[path = "handlers_dev.rs"]
mod handlers;

#[cfg(not(feature = "dev"))]
#[path = "handlers_prod.rs"]
mod handlers;

pub use handlers::*;
