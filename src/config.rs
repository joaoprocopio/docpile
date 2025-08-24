use std::{env, sync::LazyLock};

pub static DOCPIE_HOST: LazyLock<String> =
    LazyLock::new(|| env::var("DOCPIE_HOST").unwrap_or("0.0.0.0".into()));
pub static DOCPIE_PORT: LazyLock<u16> = LazyLock::new(|| {
    const DEFAULT_PORT: u16 = 8000;

    env::var("DOCPIE_PORT")
        .unwrap_or(DEFAULT_PORT.to_string())
        .parse()
        .unwrap_or(DEFAULT_PORT)
});
