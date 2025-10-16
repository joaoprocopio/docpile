use crate::{
    error::{Error, ErrorKind},
    www::config::Server,
};
use axum::{
    body::Body,
    extract::{
        FromRequest, Request, State, WebSocketUpgrade as PeerWsUpgrade,
        ws::{CloseFrame as PeerCloseFrame, Message as PeerMessage},
    },
    http::{StatusCode, Uri, header},
    response::Response,
};
use futures::{SinkExt, StreamExt};
use tokio_tungstenite::{
    connect_async,
    tungstenite::{
        handshake::client::Request as UpstreamRequest,
        protocol::{CloseFrame as UpstreamCloseFrame, Message as UpstreamMessage},
    },
};

const UPSTREAM: &str = "localhost:3333";

pub async fn proxy(State(server): State<Server>, req: Request) -> Result<Response, Error> {
    if is_ws(&req) {
        return proxy_ws(server, req).await;
    }

    proxy_http(server, req).await
}

fn is_ws(req: &Request) -> bool {
    req.headers()
        .get(header::UPGRADE)
        .map(|v| v.as_bytes().eq_ignore_ascii_case(b"websocket"))
        .unwrap_or(false)
}

async fn proxy_ws(server: Server, req: Request) -> Result<Response, Error> {
    let path_and_query = req
        .uri()
        .path_and_query()
        .and_then(|v| Some(v.as_str()))
        .unwrap_or("/");

    let mut ws_req = UpstreamRequest::new(());

    *ws_req.uri_mut() = Uri::try_from(format!("ws://{UPSTREAM}{path_and_query}"))
        .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Peer, e))?;
    *ws_req.version_mut() = req.version();
    *ws_req.method_mut() = req.method().to_owned();
    *ws_req.extensions_mut() = req.extensions().to_owned();
    *ws_req.headers_mut() = req.headers().to_owned();

    let upgrade = PeerWsUpgrade::from_request(req, &server)
        .await
        .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Peer, e))?;

    let response = upgrade.on_upgrade(|peer| async move {
        let (upstream, _) = match connect_async(ws_req).await {
            Ok(conn) => conn,
            Err(_) => return,
        };

        let (mut peer_sender, mut peer_receiver) = peer.split();
        let (mut upstream_sender, mut upstream_receiver) = upstream.split();

        let peer_to_upstream = server.handle.spawn(async move {
            while let Some(Ok(msg)) = peer_receiver.next().await {
                match msg {
                    PeerMessage::Binary(bytes) => {
                        upstream_sender
                            .send(UpstreamMessage::Binary(bytes))
                            .await
                            .ok();
                    }
                    PeerMessage::Ping(bytes) => {
                        upstream_sender
                            .send(UpstreamMessage::Ping(bytes.into()))
                            .await
                            .ok();
                    }
                    PeerMessage::Pong(bytes) => {
                        upstream_sender
                            .send(UpstreamMessage::Pong(bytes.into()))
                            .await
                            .ok();
                    }
                    PeerMessage::Text(utf8_bytes) => {
                        upstream_sender
                            .send(UpstreamMessage::Text(utf8_bytes.as_str().into()))
                            .await
                            .ok();
                    }
                    PeerMessage::Close(frame) => {
                        upstream_sender
                            .send(UpstreamMessage::Close(frame.map(|f| UpstreamCloseFrame {
                                code: f.code.into(),
                                reason: f.reason.as_str().into(),
                            })))
                            .await
                            .ok();

                        break;
                    }
                };
            }
        });

        let upstream_to_peer = server.handle.spawn(async move {
            while let Some(Ok(msg)) = upstream_receiver.next().await {
                match msg {
                    UpstreamMessage::Binary(bytes) => {
                        peer_sender.send(PeerMessage::Binary(bytes)).await.ok();
                    }
                    UpstreamMessage::Ping(bytes) => {
                        peer_sender.send(PeerMessage::Ping(bytes.into())).await.ok();
                    }
                    UpstreamMessage::Pong(bytes) => {
                        peer_sender.send(PeerMessage::Pong(bytes.into())).await.ok();
                    }
                    UpstreamMessage::Text(utf8_bytes) => {
                        peer_sender
                            .send(PeerMessage::Text(utf8_bytes.as_str().into()))
                            .await
                            .ok();
                    }
                    UpstreamMessage::Close(frame) => {
                        peer_sender
                            .send(PeerMessage::Close(frame.map(|f| PeerCloseFrame {
                                code: f.code.into(),
                                reason: f.reason.as_str().into(),
                            })))
                            .await
                            .ok();

                        break;
                    }
                    _ => todo!(),
                };
            }
        });

        tokio::select! {
            _ = peer_to_upstream => {}
            _ = upstream_to_peer => {}
        };
    });

    Ok(response)
}

async fn proxy_http(server: Server, req: Request) -> Result<Response, Error> {
    let uri = req.uri();
    let scheme = uri.scheme_str().unwrap_or("http");
    let path = uri
        .path_and_query()
        .and_then(|p| Some(p.as_str()))
        .unwrap_or("/");

    let upstream = reqwest::Url::parse(format!("{scheme}://{UPSTREAM}{path}").as_str())
        .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Upstream, e))?;
    let upstream = reqwest::Request::new(req.method().to_owned(), upstream);
    let upstream = server
        .client
        .execute(upstream)
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
        .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Upstream, e))?
        .into();

    Ok(peer)
}
