use crate::{
    error::{Error, ErrorKind, Result},
    www::config::Server,
};
use axum::{
    extract::{Request, State},
    http::{HeaderName, StatusCode, Uri, header},
    response::{IntoResponse, Response},
};
use std::sync::LazyLock;

const RFC_2616_HOP_BY_HOP_HEADERS: LazyLock<[HeaderName; 8]> = LazyLock::new(|| {
    [
        header::CONNECTION,
        header::HeaderName::from_static("keep-alive"),
        header::PROXY_AUTHENTICATE,
        header::PROXY_AUTHORIZATION,
        header::TE,
        header::TRAILER,
        header::TRANSFER_ENCODING,
        header::UPGRADE,
    ]
});

pub async fn proxy(State(server): State<Server>, request: Request) -> Result<Response, Error> {
    let (mut parts, body) = request.into_parts();

    let upstream = format!(
        "{}://{}:{}{}",
        &parts.uri.scheme_str().unwrap_or("http"),
        &server.env.dev_upstream_host,
        &server.env.dev_upstream_port,
        &parts
            .uri
            .path_and_query()
            .and_then(|p| Some(p.as_str()))
            .unwrap_or("/")
    );

    parts.uri = Uri::try_from(upstream.as_str())
        .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Server, e))?;

    for header in &*RFC_2616_HOP_BY_HOP_HEADERS {
        parts.headers.remove(header);
    }
    parts.headers.remove(header::HOST);

    let request = Request::from_parts(parts, body);

    let mut response = server
        .client
        .request(request)
        .await
        .map_err(|e| Error::from_status(StatusCode::BAD_GATEWAY, ErrorKind::Upstream, e))?;

    {
        let headers = response.headers_mut();

        for header in &*RFC_2616_HOP_BY_HOP_HEADERS {
            headers.remove(header);
        }
    }

    Ok(response.into_response())
}
