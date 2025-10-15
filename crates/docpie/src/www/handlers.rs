use crate::error::ErrorKind;
use crate::{error::Error, www::config::Server};
use axum::{
    body::Body,
    extract::{Request, State},
    http::StatusCode,
    response::Response,
};

pub async fn spa(State(server): State<Server>, req: Request) -> Result<Response, Error> {
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
