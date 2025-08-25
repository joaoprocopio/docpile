use std::thread;
use tokio::{net::TcpListener, runtime};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

async fn run_server(handle: runtime::Handle) -> docpie::Result<()> {
    let server = docpie::Server::new(handle);
    let socket = docpie::net::create_reusable_socket((&*server.env.host, server.env.port)).await?;
    let listener = TcpListener::from_std(socket.into())?;

    tracing::info!("server listening on: http://{}", listener.local_addr()?);

    let routes = docpie::routes(&server).with_state(server);

    axum::serve(listener, routes)
        .with_graceful_shutdown(docpie::graceful::shutdown_signal().await?)
        .await?;

    tracing::info!("successfully shutdown server");

    Ok(())
}

fn run_server_blocking(runtime: runtime::Runtime) {
    if let Err(err) = runtime.block_on(async { run_server(runtime.handle().clone()).await }) {
        tracing::error!("fatal error occurred: {}", err);
        std::process::exit(1);
    };
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

    let threads = match std::thread::available_parallelism() {
        Ok(threads) => threads.get(),
        Err(err) => {
            tracing::error!("failed to get available parallelism: {}", err);
            std::process::exit(1);
        }
    };

    for _ in 1..threads {
        thread::spawn(|| {
            let runtime = docpie::runtime::new_current_thread();
            run_server_blocking(runtime);
        });
    }

    let runtime = docpie::runtime::new_current_thread();
    run_server_blocking(runtime);
}
