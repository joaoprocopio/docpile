pub use router::router;

#[cfg(feature = "dev")]
mod router {
    use crate::{
        error::{Error, ErrorKind, Result},
        www::config::Server,
    };
    use axum::{
        Router,
        body::{Body, to_bytes},
        extract::{Request, State},
        http::{
            HeaderName, StatusCode, header,
            uri::{PathAndQuery, Scheme},
        },
        response::Response,
        routing,
    };
    use reqwest::{Request as UpstreamRequest, Url as UpstreamUrl};
    use std::sync::LazyLock;

    pub fn router(_: &Server) -> Router<Server> {
        Router::new().fallback(routing::any(proxy))
    }

    async fn proxy(State(server): State<Server>, peer_req: Request) -> Result<Response, Error> {
        let (peer_parts, peer_body) = peer_req.into_parts();

        let upstream_url = UpstreamUrl::parse(
            format!(
                "{}://{}{}",
                &peer_parts
                    .uri
                    .scheme()
                    .cloned()
                    .unwrap_or_else(|| Scheme::HTTP),
                &server.env.addr,
                &peer_parts
                    .uri
                    .path_and_query()
                    .cloned()
                    .unwrap_or_else(|| PathAndQuery::from_static("/"))
            )
            .as_str(),
        )
        .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Server, e))?;

        let mut upstream_req = UpstreamRequest::new(peer_parts.method, upstream_url);

        *upstream_req.headers_mut() = peer_parts.headers;
        *upstream_req.version_mut() = peer_parts.version;
        *upstream_req.body_mut() = Some(
            to_bytes(peer_body, usize::MAX)
                .await
                .map_err(|e| Error::from_status(StatusCode::BAD_REQUEST, ErrorKind::Server, e))?
                .into(),
        );

        remove_hop_by_hop_headers(upstream_req.headers_mut());

        let mut upstream_res = server
            .client
            .execute(upstream_req)
            .await
            .map_err(|e| Error::from_status(StatusCode::BAD_GATEWAY, ErrorKind::Upstream, e))?;

        remove_hop_by_hop_headers(upstream_res.headers_mut());

        let mut peer_res = Response::new(Body::empty());

        *peer_res.status_mut() = upstream_res.status();
        *peer_res.headers_mut() = upstream_res.headers().clone();
        *peer_res.version_mut() = upstream_res.version();
        *peer_res.body_mut() = upstream_res
            .bytes()
            .await
            .map_err(|e| Error::from_status(StatusCode::BAD_GATEWAY, ErrorKind::Upstream, e))?
            .into();

        Ok(peer_res)
    }

    fn remove_hop_by_hop_headers(headers: &mut axum::http::HeaderMap) {
        for header in &*RFC_2616_HOP_BY_HOP_HEADERS {
            headers.remove(header);
        }
    }

    // https://datatracker.ietf.org/doc/html/rfc2616#section-13.5.1
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
}

#[cfg(feature = "prod")]
mod router {
    use crate::www::config::Server;
    use axum::Router;
    use mime::TEXT_HTML_UTF_8;
    use tower_http::services::{ServeDir, ServeFile};

    pub fn router(server: &Server) -> Router<Server> {
        let dir = &server.env.upstream_root_dir;
        let html = format!("{}/index.html", dir.to_string_lossy());
        let spa = ServeDir::new(dir)
            .append_index_html_on_directories(false)
            .call_fallback_on_method_not_allowed(false)
            .fallback(ServeFile::new_with_mime(html, &TEXT_HTML_UTF_8));

        Router::new().fallback_service(spa)
    }
}
