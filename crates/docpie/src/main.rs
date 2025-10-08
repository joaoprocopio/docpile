use axum::serve as serve_http;
use docpie::{
    ext,
    server::{
        graceful::{ShutdownSignalError, shutdown_signal},
        router::{NewRouterError, new_router},
        state::{NewServerError, Server},
    },
};
use tokio::{net::TcpListener, runtime::Handle};

fn main() {
    ext::tracing::init();
    let rt = ext::tokio::new_runtime();

    rt.block_on(async { run_server(rt.handle().clone()).await })
        .unwrap_or_else(|err| {
            tracing::error!(?err);
            std::process::exit(1);
        });
}

#[derive(thiserror::Error, Debug)]
pub enum RunServerError {
    #[error(transparent)]
    NewRouter(#[from] NewRouterError),

    #[error(transparent)]
    NewServer(#[from] NewServerError),

    #[error(transparent)]
    TokioIO(#[from] tokio::io::Error),

    #[error(transparent)]
    ShutdownSignal(#[from] ShutdownSignalError),
}

async fn run_server(handle: Handle) -> Result<(), RunServerError> {
    let server = Server::new(handle).await?;
    let listener = TcpListener::bind((&*server.env.host, server.env.port)).await?;

    tracing::info!("server listening on: http://{}", listener.local_addr()?);

    let router = new_router(&server).await?.with_state(server);

    serve_http(listener, router)
        .with_graceful_shutdown(shutdown_signal().await?)
        .await?;

    tracing::info!("successfully shutdown server");

    Ok(())
}
