use crate::{
    error::{Error, ErrorKind, Result},
    www::config::Server,
};
use axum::{
    body::Body,
    extract::{
        FromRequest, Request, State, WebSocketUpgrade as PeerWsUpgrade,
        ws::{CloseFrame as PeerCloseFrame, Message as PeerMessage, WebSocket as PeerWebSocket},
    },
    http::{StatusCode, Uri, header},
    response::Response,
};
use futures::{
    SinkExt, StreamExt,
    stream::{SplitSink, SplitStream},
};
use tokio::net::TcpStream;
use tokio_tungstenite::{
    MaybeTlsStream as UpstreamMaybeTlsStream, WebSocketStream as UpstreamWebSocketStream,
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

        let (peer_sender, peer_receiver) = peer.split();
        let (upstream_sender, upstream_receiver) = upstream.split();

        let peer_to_upstream = server
            .handle
            .spawn(sender_to_upstream_proxy(peer_receiver, upstream_sender));

        let upstream_to_peer = server
            .handle
            .spawn(upstream_to_sender_proxy(upstream_receiver, peer_sender));

        tokio::select! {
            ptu_result = peer_to_upstream => {
                if let Ok(Err(ref err)) = ptu_result {
                    tracing::error!(?err);
                }

                if let Err(ref err) = ptu_result {
                    tracing::error!(?err);
                }
            }

            utp_result = upstream_to_peer => {
                if let Ok(Err(ref err)) = utp_result {
                    tracing::error!(?err);
                }

                if let Err(ref err) = utp_result {
                    tracing::error!(?err);
                }
            }
        };
    });

    Ok(response)
}

async fn sender_to_upstream_proxy(
    mut receiver: SplitStream<PeerWebSocket>,
    mut sender: SplitSink<
        UpstreamWebSocketStream<UpstreamMaybeTlsStream<TcpStream>>,
        UpstreamMessage,
    >,
) -> Result<()> {
    loop {
        let res: Result<()> = match receiver.next().await {
            Some(Ok(msg)) => match msg {
                PeerMessage::Binary(bytes) => sender
                    .send(UpstreamMessage::Binary(bytes))
                    .await
                    .map_err(|e| e.into()),
                PeerMessage::Ping(bytes) => sender
                    .send(UpstreamMessage::Ping(bytes.into()))
                    .await
                    .map_err(|e| e.into()),
                PeerMessage::Pong(bytes) => sender
                    .send(UpstreamMessage::Pong(bytes.into()))
                    .await
                    .map_err(|e| e.into()),
                PeerMessage::Text(utf8_bytes) => sender
                    .send(UpstreamMessage::Text(utf8_bytes.as_str().into()))
                    .await
                    .map_err(|e| e.into()),
                PeerMessage::Close(frame) => {
                    break sender
                        .send(UpstreamMessage::Close(frame.map(|f| UpstreamCloseFrame {
                            code: f.code.into(),
                            reason: f.reason.as_str().into(),
                        })))
                        .await
                        .map_err(|e| e.into());
                }
            },
            Some(Err(err)) => Err(err.into()),
            None => Ok(()),
        };

        let _ = res.inspect_err(|err| tracing::error!(?err));
    }
}

async fn upstream_to_sender_proxy(
    mut receiver: SplitStream<UpstreamWebSocketStream<UpstreamMaybeTlsStream<TcpStream>>>,
    mut sender: SplitSink<PeerWebSocket, PeerMessage>,
) -> Result<()> {
    loop {
        let res: Result<()> = match receiver.next().await {
            Some(Ok(msg)) => match msg {
                UpstreamMessage::Binary(bytes) => sender
                    .send(PeerMessage::Binary(bytes))
                    .await
                    .map_err(|e| e.into()),
                UpstreamMessage::Ping(bytes) => sender
                    .send(PeerMessage::Ping(bytes.into()))
                    .await
                    .map_err(|e| e.into()),
                UpstreamMessage::Pong(bytes) => sender
                    .send(PeerMessage::Pong(bytes.into()))
                    .await
                    .map_err(|e| e.into()),
                UpstreamMessage::Text(utf8_bytes) => sender
                    .send(PeerMessage::Text(utf8_bytes.as_str().into()))
                    .await
                    .map_err(|e| e.into()),
                UpstreamMessage::Close(frame) => {
                    break sender
                        .send(PeerMessage::Close(frame.map(|f| PeerCloseFrame {
                            code: f.code.into(),
                            reason: f.reason.as_str().into(),
                        })))
                        .await
                        .map_err(|e| e.into());
                }
                _ => panic!(),
            },
            Some(Err(err)) => Err(err.into()),
            None => Ok(()),
        };

        let _ = res.inspect_err(|err| tracing::error!(?err));
    }
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
