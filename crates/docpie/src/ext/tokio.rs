pub fn new_runtime() -> tokio::runtime::Runtime {
    match tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
    {
        Ok(rt) => rt,
        Err(err) => {
            tracing::error!("failed to create runtime: {}", err);
            std::process::exit(1);
        }
    }
}
