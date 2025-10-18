use axum::serve;
use docpie::{
    error::Result,
    ext,
    graceful::shutdown_signal,
    http::{config::Server as HttpServer, router as new_http_router},
    prelude::*,
    www::{config::Server as WwwServer, router as new_www_router},
};
use tokio::{net::TcpListener, runtime::Handle};

fn main() {
    ext::tracing::init();
    let rt = ext::tokio::new_runtime();

    rt.block_on(async { run(rt.handle().clone()).await })
        .unwrap_or_else(|err| {
            tracing::error!(?err);
            std::process::exit(1);
        });
}

async fn run(handle: Handle) -> Result<()> {
    let signal = shutdown_signal().await?.shared();

    let services = tokio::join!(
        handle.spawn(serve_www(signal.clone())),
        handle.spawn(serve_http(signal.clone(), handle.clone()))
    );

    services.0??;
    services.1??;

    tracing::info!("all services gracefully shutdown");

    Ok(())
}

async fn serve_www(signal: impl Future<Output = ()> + Send + 'static) -> Result<()> {
    let server = WwwServer::new()?;
    let listener = TcpListener::bind(server.env.addr.as_str()).await?;

    let router = new_www_router(&server).with_state(server);

    tracing::info!("www listening on: http://{}", listener.local_addr()?);

    serve(listener, router)
        .with_graceful_shutdown(signal)
        .await?;

    tracing::info!("successfully shutdown www");

    Ok(())
}

async fn serve_http(
    signal: impl Future<Output = ()> + Send + 'static,
    handle: Handle,
) -> Result<()> {
    let server = HttpServer::new(handle).await?;
    let listener = TcpListener::bind(server.env.addr.as_str()).await?;

    let router = new_http_router(&server).await?.with_state(server);

    tracing::info!("server listening on: http://{}", listener.local_addr()?);

    serve(listener, router)
        .with_graceful_shutdown(signal)
        .await?;

    tracing::info!("successfully shutdown server");

    Ok(())
}
