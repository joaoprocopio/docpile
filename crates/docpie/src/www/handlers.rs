use crate::{
    error::{Error, ErrorKind, Result},
    www::config::Server,
};
use axum::{
    extract::{Request, State},
    http::{HeaderName, StatusCode, header},
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

pub async fn proxy(
    State(server): State<Server>,
    request: Request,
) -> Result<reqwest::Response, Error> {
    let uri = request.uri();
    let scheme = uri.scheme_str().unwrap_or("http");
    let path = uri
        .path_and_query()
        .and_then(|p| Some(p.as_str()))
        .unwrap_or("/");

    let upstream = format!(
        "{}://{}:{}{}",
        scheme, &server.env.dev_upstream_host, &server.env.dev_upstream_port, path
    );
    let upstream = reqwest::Url::parse(upstream.as_str())
        .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Server, e))?;

    let mut request = reqwest::Request::new(request.method().clone(), upstream);

    {
        let headers = request.headers_mut();
        for header in &*RFC_2616_HOP_BY_HOP_HEADERS {
            headers.remove(header);
        }
        headers.remove(header::HOST);
    }

    let mut response = server
        .client
        .execute(request)
        .await
        .map_err(|e| Error::from_status(StatusCode::BAD_GATEWAY, ErrorKind::Upstream, e))?;

    {
        let headers = response.headers_mut();
        for header in &*RFC_2616_HOP_BY_HOP_HEADERS {
            headers.remove(header);
        }
    }

    Ok(response)
}
