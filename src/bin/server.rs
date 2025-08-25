use tokio::{net::TcpListener, runtime};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

async fn run(handle: runtime::Handle) -> docpie::Result<()> {
    let server = docpie::Server::new(handle);
    let listener = TcpListener::bind((&*server.env.host, server.env.port)).await?;

    tracing::info!("server listening on: http://{}", listener.local_addr()?);

    axum::serve(listener, docpie::routes().with_state(server))
        .with_graceful_shutdown(docpie::graceful::shutdown_signal().await?)
        .await?;

    tracing::info!("successfully shutdown server");

    Ok(())
}

fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::fmt::layer()
                .with_timer(tracing_subscriber::fmt::time::uptime())
                .with_thread_ids(true)
                .with_target(true)
                .with_line_number(true)
                .with_file(true),
        )
        .init();

    let runtime = match runtime::Builder::new_current_thread().enable_all().build() {
        Ok(rt) => rt,
        Err(err) => {
            tracing::error!("failed to create runtime: {}", err);
            std::process::exit(1);
        }
    };

    if let Err(err) = runtime.block_on(async { run(runtime.handle().clone()).await }) {
        tracing::error!("fatal error occurred: {}", err);
        std::process::exit(1);
    }
}
