use axum::Router;
use docpie::{Result, config, graceful};
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

async fn run() -> Result<()> {
    let app = Router::new().layer(TraceLayer::new_for_http());
    let listener = TcpListener::bind((config::DOCPIE_HOST.as_str(), *config::DOCPIE_PORT)).await?;
    let addr = listener.local_addr()?;

    tracing::info!("server listening on: http://{}", addr);

    axum::serve(listener, app)
        .with_graceful_shutdown(graceful::shutdown_signal().await?)
        .await?;

    tracing::info!("successfully shutdown server");

    Ok(())
}

#[tokio::main(flavor = "current_thread")]
async fn main() {
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

    if let Err(err) = run().await {
        tracing::error!("fatal error occurred: {}", err);
        std::process::exit(1);
    }
}
