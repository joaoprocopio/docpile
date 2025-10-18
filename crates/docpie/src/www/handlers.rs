use crate::{
    error::{Error, ErrorKind, Result},
    www::config::Server,
};
use axum::{
    extract::{Request, State},
    http::{
        HeaderName, StatusCode, Uri, header,
        uri::{Authority, PathAndQuery, Scheme},
    },
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

fn remove_hop_by_hop_headers(headers: &mut axum::http::HeaderMap) {
    for header in &*RFC_2616_HOP_BY_HOP_HEADERS {
        headers.remove(header);
    }
}

pub async fn proxy(State(server): State<Server>, request: Request) -> Result<Response, Error> {
    let (mut parts, body) = request.into_parts();

    parts.uri = Uri::builder()
        .authority(
            Authority::try_from(format!(
                "{}:{}",
                server.env.dev_upstream_host, server.env.dev_upstream_port
            ))
            .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Server, e))?,
        )
        .scheme(parts.uri.scheme().cloned().unwrap_or_else(|| Scheme::HTTP))
        .path_and_query(
            parts
                .uri
                .path_and_query()
                .cloned()
                .unwrap_or_else(|| PathAndQuery::from_static("/")),
        )
        .build()
        .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Server, e))?;

    remove_hop_by_hop_headers(&mut parts.headers);

    let mut response = server
        .client
        .request(Request::from_parts(parts, body))
        .await
        .map_err(|e| Error::from_status(StatusCode::BAD_GATEWAY, ErrorKind::Upstream, e))?;

    remove_hop_by_hop_headers(response.headers_mut());

    Ok(response.into_response())
}
