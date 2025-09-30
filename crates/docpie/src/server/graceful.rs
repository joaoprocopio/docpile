use tokio::signal::unix::{SignalKind, signal};

pub async fn graceful_shutdown_signal() -> crate::Result<impl Future<Output = ()>> {
    let mut terminate = signal(SignalKind::terminate())?;
    let mut interrupt = signal(SignalKind::interrupt())?;

    let signal_watcher = async move {
        tokio::select! {
            _ = terminate.recv() => {
                tracing::debug!("recv terminate signal")
            },
            _ = interrupt.recv() => {
                tracing::debug!("recv interrupt signal")
            }
        }
    };

    Ok(signal_watcher)
}
