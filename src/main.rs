use axum::Router;
use docpie::{BoxedError, graceful};
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

async fn run() -> Result<(), BoxedError> {
    let app = Router::new().layer(TraceLayer::new_for_http());
    let listener = TcpListener::bind(&*docpie::conf::DOCPIE_ADDR).await?;

    tracing::info!(
        "server listening on: http://{}",
        &*docpie::conf::DOCPIE_ADDR
    );

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
