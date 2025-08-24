pub mod conf;
pub mod graceful;

pub type BoxedError = Box<dyn std::error::Error>;
