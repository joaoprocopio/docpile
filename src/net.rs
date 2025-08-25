use socket2::{Domain, SockAddr, Socket};
use std::net::SocketAddr;
use tokio::net::{ToSocketAddrs, lookup_host};

pub async fn create_reusable_socket<T: ToSocketAddrs>(addr: T) -> crate::Result<Socket> {
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

    socket.set_reuse_port(true)?;
    socket.set_reuse_address(true)?;
    socket.set_tcp_nodelay(true)?;
    socket.set_nonblocking(true)?;
    socket.bind(&addr)?;
    socket.listen(backlog)?;

    Ok(socket)
}
