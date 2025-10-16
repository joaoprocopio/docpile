use crate::{
    error::{Error, ErrorKind},
    www::config::Server,
};
use axum::{
    body::Body,
    extract::{FromRequest, Request, State, WebSocketUpgrade as WsUpgrade, ws::Message},
    http::{StatusCode, Uri, header},
    response::Response,
};
use futures::{SinkExt, StreamExt};
use tokio_tungstenite::{
    connect_async,
    tungstenite::{handshake::client::Request as WsRequest, protocol::Message as WsMessage},
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

async fn proxy_ws(_server: Server, mut req: Request) -> Result<Response, Error> {
    let path_and_query = req
        .uri()
        .path_and_query()
        .and_then(|v| Some(v.as_str()))
        .unwrap_or("/");

    let uri = Uri::try_from(format!("ws://{UPSTREAM}{path_and_query}"))
        .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Peer, e))?;

    {
        let headers = req.headers_mut();

        headers.remove(header::HOST);
        headers.insert(
            header::ORIGIN,
            format!("http://{UPSTREAM}")
                .parse()
                .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Peer, e))?,
        );
    }

    let mut ws_req = WsRequest::new(());

    *ws_req.uri_mut() = uri;
    *ws_req.version_mut() = req.version();
    *ws_req.headers_mut() = req.headers().to_owned();
    *ws_req.extensions_mut() = req.extensions().to_owned();

    dbg!(&ws_req);

    let response = WsUpgrade::from_request(req, &_server)
        .await
        .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Peer, e))?
        .on_upgrade(|client_ws| async move {
            let (vite_ws, _) = match connect_async(ws_req).await {
                Ok(conn) => conn,
                Err(_) => return,
            };

            let (mut vite_sink, mut vite_stream) = vite_ws.split();
            let (mut client_sink, mut client_stream) = client_ws.split();

            let to_vite = async {
                while let Some(Ok(msg)) = client_stream.next().await {
                    match msg {
                        Message::Text(text) => vite_sink
                            .send(WsMessage::Text(text.as_str().into()))
                            .await
                            .ok(),
                        Message::Binary(bin) => vite_sink.send(WsMessage::Binary(bin)).await.ok(),
                        Message::Ping(p) => vite_sink.send(WsMessage::Ping(p)).await.ok(),
                        Message::Pong(p) => vite_sink.send(WsMessage::Pong(p)).await.ok(),
                        Message::Close(_) => {
                            vite_sink.send(WsMessage::Close(None)).await.ok();
                            break;
                        }
                    };
                }
            };

            let to_client = async {
                while let Some(Ok(msg)) = vite_stream.next().await {
                    match msg {
                        WsMessage::Text(text) => client_sink
                            .send(Message::Text(text.as_str().into()))
                            .await
                            .ok(),
                        WsMessage::Binary(bin) => client_sink.send(Message::Binary(bin)).await.ok(),
                        WsMessage::Ping(p) => client_sink.send(Message::Ping(p)).await.ok(),
                        WsMessage::Pong(p) => client_sink.send(Message::Pong(p)).await.ok(),
                        WsMessage::Close(_) => {
                            client_sink.send(Message::Close(None)).await.ok();
                            break;
                        }
                        WsMessage::Frame(_) => return,
                    };
                }
            };

            tokio::select! {
                _ = to_vite => (),
                _ = to_client => (),
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
