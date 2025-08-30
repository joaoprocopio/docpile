use socket2::{Domain, SockAddr, Socket};
use std::net::SocketAddr;
use tokio::net::{ToSocketAddrs, lookup_host};
use tokio::{net::TcpListener, runtime};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::fmt::layer()
                .with_thread_ids(true)
                .with_target(true)
                .with_line_number(true)
                .with_file(true),
        )
        .init();

    let runtime = docpie::runtime::new();
    run_server_blocking(runtime);
}

fn run_server_blocking(runtime: runtime::Runtime) {
    if let Err(err) = runtime.block_on(async { run_server(runtime.handle().clone()).await }) {
        tracing::error!("fatal error occurred: {}", err);
        std::process::exit(1);
    };
}

async fn run_server(handle: runtime::Handle) -> docpie::Result<()> {
    let server = docpie::Server::new(handle);
    let socket = create_socket((&*server.env.host, server.env.port)).await?;
    let listener = TcpListener::from_std(socket.into())?;

    tracing::info!("server listening on: http://{}", listener.local_addr()?);

    let routes = docpie::routes(&server).with_state(server);

    axum::serve(listener, routes)
        .with_graceful_shutdown(docpie::graceful::shutdown_signal().await?)
        .await?;

    tracing::info!("successfully shutdown server");

    Ok(())
}

async fn create_socket<T: ToSocketAddrs>(addr: T) -> docpie::Result<Socket> {
    let addr = lookup_host(addr)
        .await?
        .next()
        .ok_or("no address was found")?;

    let domain = match addr {
        SocketAddr::V4(_) => Domain::IPV4,
        SocketAddr::V6(_) => Domain::IPV6,
    };
    let addr = SockAddr::from(addr);
    let socket = Socket::new(domain, socket2::Type::STREAM, Some(socket2::Protocol::TCP))?;
    let backlog = 4096;

    socket.set_tcp_nodelay(true)?;
    socket.set_nonblocking(true)?;
    socket.bind(&addr)?;
    socket.listen(backlog)?;

    Ok(socket)
}
