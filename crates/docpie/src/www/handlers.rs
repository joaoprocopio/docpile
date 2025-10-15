use crate::error::{ErrorKind, Result};
use crate::{error::Error, www::config::Server};
use axum::{
    body::Body,
    extract::{Request, State},
    http::{StatusCode, header},
    response::Response,
};

fn is_ws(req: &Request) -> bool {
    req.headers()
        .get(header::UPGRADE)
        .map(|v| v.as_bytes().eq_ignore_ascii_case(b"websocket"))
        .unwrap_or(false)
}

pub async fn proxy(State(server): State<Server>, req: Request) -> Result<Response, Error> {
    if is_ws(&req) {
        return proxy_ws(server, req).await;
    }

    proxy_http(server, req).await
}

async fn proxy_ws(server: Server, req: Request) -> Result<Response, Error> {
    todo!();
    // let uri = req.uri().to_owned();
    // let sock_upgrade = WebSocketUpgrade::from_request(req, &server)
    //     .await
    //     .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Peer, e))?;

    // let res = sock_upgrade.on_upgrade(|ws| async move {
    //     let stream = connect_async(uri).await;
    // });

    // Ok(res)
}

async fn proxy_http(server: Server, req: Request) -> Result<Response, Error> {
    let scheme = req.uri().scheme_str().unwrap_or("http");
    let path = req
        .uri()
        .path_and_query()
        .and_then(|p| Some(p.as_str()))
        .unwrap_or("/");

    let upstream = server
        .client
        .get(format!("{}://localhost:3333{}", scheme, path))
        .send()
        .await
        .map_err(|e| Error::from_status(StatusCode::BAD_GATEWAY, ErrorKind::Upstream, e))?;

    let mut peer = Response::new(Body::empty());

    *peer.status_mut() = upstream.status();
    *peer.version_mut() = upstream.version();
    *peer.headers_mut() = upstream.headers().to_owned();
    *peer.extensions_mut() = upstream.extensions().to_owned();
    *peer.body_mut() = upstream
        .bytes()
        .await
        .map_err(|e| Error::from_status(StatusCode::BAD_GATEWAY, ErrorKind::Upstream, e))?
        .into();

    Ok(peer)
}
