#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

pub use sqlx::prelude::*;

pub mod auth;
pub mod db;
pub mod ext;
pub mod org;
pub mod server;
