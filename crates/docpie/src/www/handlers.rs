#[cfg(debug_assertions)]
#[path = "handlers_dev.rs"]
mod handlers;

#[cfg(not(debug_assertions))]
#[path = "handlers_prod.rs"]
mod handlers;

pub use handlers::*;
