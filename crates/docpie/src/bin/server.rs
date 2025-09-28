use docpie::Result;
use docpie::config::Server;
use docpie::graceful::shutdown_signal;
use docpie::routing::new_router;
use docpie::runtime::new_runtime;
use std::sync::Arc;
use tokio::{
    net::TcpListener,
    runtime::{Handle, Runtime},
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::fmt::layer()
                .with_thread_ids(true)
                .with_target(true)
                .with_line_number(true)
                .with_file(true),
        )
        .init();

    let runtime = new_runtime();
    run_server_blocking(runtime);
}

fn run_server_blocking(runtime: Runtime) {
    if let Err(err) = runtime.block_on(async { run_server(runtime.handle().clone()).await }) {
        tracing::error!("fatal error occurred: {}", err);
        std::process::exit(1);
    };
}

async fn run_server(handle: Handle) -> Result<()> {
    let server = Arc::new(Server::new(handle).await?);
    let listener = TcpListener::bind((&*server.env.host, server.env.port)).await?;

    tracing::info!("server listening on: http://{}", listener.local_addr()?);

    let router = new_router(server.as_ref()).with_state(server);

    axum::serve(listener, router)
        .with_graceful_shutdown(shutdown_signal().await?)
        .await?;

    tracing::info!("successfully shutdown server");

    Ok(())
}
