use tokio::runtime;

pub fn new() -> runtime::Runtime {
    match runtime::Builder::new_multi_thread().enable_all().build() {
        Ok(rt) => rt,
        Err(err) => {
            tracing::error!("failed to create runtime: {}", err);
            std::process::exit(1);
        }
    }
}
