use axum::{Router, routing::get};
use tokio::{net::TcpListener, signal};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

static ADDR: &str = "0.0.0.0:3000";

type BoxedError = Box<dyn std::error::Error>;

async fn hello() -> String {
    String::from("hello, world!")
}

async fn shutdown_signal() -> Result<impl Future<Output = ()>, BoxedError> {
    let mut terminate = signal::unix::signal(signal::unix::SignalKind::terminate())?;
    let mut interrupt = signal::unix::signal(signal::unix::SignalKind::interrupt())?;

    let signal_watcher = async move {
        tokio::select! {
            _ = terminate.recv() => {
                tracing::info!("recv terminate signal")
            },
            _ = interrupt.recv() => {
                tracing::info!("recv interrupt signal")
            }
        }
    };

    Ok(signal_watcher)
}

async fn run() -> Result<(), BoxedError> {
    let app = Router::new()
        .route("/", get(hello))
        .layer(TraceLayer::new_for_http());
    let listener = TcpListener::bind(ADDR).await?;

    tracing::info!("starting server...");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal().await?)
        .await?;

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
        tracing::error!("server error: {}", err);
        std::process::exit(1);
    }
}
