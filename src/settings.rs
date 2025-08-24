use std::{env, sync::LazyLock};

pub static DOCPIE_HOST: LazyLock<String> =
    LazyLock::new(|| env::var("DOCPIE_HOST").unwrap_or("0.0.0.0".into()));
pub static DOCPIE_PORT: LazyLock<String> =
    LazyLock::new(|| env::var("DOCPIE_PORT").unwrap_or("3000".into()));
pub static DOCPIE_ADDR: LazyLock<String> =
    LazyLock::new(|| format!("{}:{}", *DOCPIE_HOST, *DOCPIE_PORT));
