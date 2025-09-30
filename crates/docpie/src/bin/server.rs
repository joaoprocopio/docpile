use axum::serve as serve_http;
use docpie::server::{Server, graceful_shutdown_signal, new_router};
use docpie::{Result, ext};
use tokio::{net::TcpListener, runtime::Handle};

fn main() {
    ext::tracing::init();
    let rt = ext::tokio::new_runtime();

    ext::dotenvy::from_current_crate().unwrap_or_else(|err| {
        tracing::error!("failed to load .env file: {}", err);
        std::process::exit(1);
    });

    rt.block_on(async { run_server(rt.handle().clone()).await })
        .unwrap_or_else(|err| {
            tracing::error!("fatal error occurred: {}", err);
            std::process::exit(1);
        });
}

async fn run_server(handle: Handle) -> Result<()> {
    let server = Server::new(handle).await?;
    let listener = TcpListener::bind((&*server.env.host, server.env.port)).await?;

    tracing::info!("server listening on: http://{}", listener.local_addr()?);

    let router = new_router(&server).with_state(server);

    serve_http(listener, router)
        .with_graceful_shutdown(graceful_shutdown_signal().await?)
        .await?;

    tracing::info!("successfully shutdown server");

    Ok(())
}
