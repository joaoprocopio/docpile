use std::{backtrace::Backtrace, fmt::Display};

// https://docs.rs/http-problem/latest/http_problem/
pub struct Error<C>
where
    C: Display + AsRef<str>,
{
    pub code: C,
    pub message: String,
    pub backtrace: Backtrace,
    pub source: Box<dyn std::error::Error + 'static + Send + Sync>,
}
