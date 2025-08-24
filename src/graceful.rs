use crate::BoxedError;
use tokio::signal::unix::{SignalKind, signal};

pub async fn shutdown_signal() -> Result<impl Future<Output = ()>, BoxedError> {
    let mut terminate = signal(SignalKind::terminate())?;
    let mut interrupt = signal(SignalKind::interrupt())?;

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
