#![forbid(unsafe_code)]
#![warn(clippy::all)]
#![warn(clippy::perf)]
#![warn(clippy::cargo)]

#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

pub mod prelude {
    pub use futures::prelude::*;
    pub use sqlx::prelude::*;
}

pub mod auth;
pub mod db;
pub mod error;
pub mod ext;
pub mod graceful;
pub mod http;
pub mod org;
pub mod www;
