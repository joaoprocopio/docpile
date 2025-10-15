use crate::error::ErrorKind;
use crate::{error::Error, www::config::Server};
use axum::{extract::State, http::StatusCode, response::Response};

#[cfg(debug_assertions)]
pub async fn spa(State(server): State<Server>) -> Result<Response, Error> {
    let res = server
        .client
        .get("http://localhost:3333")
        .send()
        .await
        .map_err(|e| Error::from_status(StatusCode::BAD_GATEWAY, ErrorKind::Upstream, e))?;

    let mut res = Response::builder()
        .status(res.status())
        .version(res.version())
        .body(
            res.bytes()
                .await
                .map_err(|e| Error::from_status(StatusCode::BAD_GATEWAY, ErrorKind::Upstream, e))?
                .into(),
        )
        .map_err(|e| Error::from_status(StatusCode::BAD_GATEWAY, ErrorKind::Upstream, e))?;

    *res.headers_mut() = res.headers().to_owned();
    *res.extensions_mut() = res.extensions().to_owned();

    Ok(res)
}
