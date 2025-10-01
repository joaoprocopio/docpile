use tokio::signal::unix::{SignalKind, signal};

#[derive(thiserror::Error, Debug)]
pub enum ShutdownSignalError {
    #[error(transparent)]
    TokioIO(#[from] tokio::io::Error),
}

pub async fn shutdown_signal() -> Result<impl Future<Output = ()>, ShutdownSignalError> {
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
