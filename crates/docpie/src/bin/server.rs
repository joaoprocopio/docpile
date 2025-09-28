use docpie::Result;
use docpie::config::Server;
use docpie::ext;
use docpie::graceful::shutdown_signal;
use docpie::routing::new_router;
use docpie::runtime::new_runtime;
use std::sync::Arc;
use tokio::{net::TcpListener, runtime::Handle};

fn main() {
    ext::tracing::init();
    let runtime = new_runtime();

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
