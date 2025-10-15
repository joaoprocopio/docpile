use axum::serve;
use docpie::{
    error::Result,
    ext,
    http::{config::Server, graceful::shutdown_signal, router::new_http_router},
    www::router::new_www_router,
};
use futures::FutureExt;
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
    let server = Server::new(handle.clone()).await?;
    let signal = shutdown_signal().await?.shared();

    let services = tokio::join!(
        handle.spawn(serve_www(server.clone(), signal.clone())),
        handle.spawn(serve_http(server.clone(), signal.clone()))
    );

    services.0??;
    services.1??;

    tracing::info!("all services gracefully shutdown");

    Ok(())
}

async fn serve_www(
    server: Server,
    signal: impl Future<Output = ()> + Send + 'static,
) -> Result<()> {
    let listener = TcpListener::bind((server.env.www_host.as_ref(), server.env.www_port)).await?;
    let router = new_www_router();

    tracing::info!("www listening on: http://{}", listener.local_addr()?);

    serve(listener, router)
        .with_graceful_shutdown(signal)
        .await?;

    tracing::info!("successfully shutdown www");

    Ok(())
}

async fn serve_http(
    server: Server,
    signal: impl Future<Output = ()> + Send + 'static,
) -> Result<()> {
    let listener = TcpListener::bind((&*server.env.host, server.env.port)).await?;
    let router = new_http_router(&server).await?.with_state(server);

    tracing::info!("server listening on: http://{}", listener.local_addr()?);

    serve(listener, router)
        .with_graceful_shutdown(signal)
        .await?;

    tracing::info!("successfully shutdown server");

    Ok(())
}
