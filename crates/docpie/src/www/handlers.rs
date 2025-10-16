use axum::{
    body::Body,
    extract::{Request, State},
    http::{HeaderName, StatusCode, header},
    response::{IntoResponse, Response},
};
use hyper::upgrade::Upgraded;
use hyper_util::{
    client::legacy::{Client, connect::HttpConnector},
    rt::{TokioExecutor, TokioIo},
};
use tokio::io::copy_bidirectional;

use crate::www::config::Server;

// Headers that should not be forwarded for regular requests
const HOP_HEADERS: &[HeaderName] = &[
    header::CONNECTION,
    header::PROXY_AUTHENTICATE,
    header::PROXY_AUTHORIZATION,
    header::TE,
    header::TRAILER,
    header::TRANSFER_ENCODING,
];

pub async fn proxy(State(server): State<Server>, mut req: Request) -> Response {
    let proxy_target = &server.env.proxy_target;
    let client: Client<HttpConnector, Body> = Client::builder(TokioExecutor::new())
        .build(hyper_util::client::legacy::connect::HttpConnector::new());

    // Check if this is an upgrade request (e.g., WebSocket)
    let is_upgrade = req.headers().get(header::UPGRADE).is_some();

    // Build the target URL for Vite dev server
    let uri = req.uri();
    let target_uri_str = format!(
        "{}{}{}",
        proxy_target,
        uri.path(),
        uri.query().map(|q| format!("?{}", q)).unwrap_or_default()
    );

    tracing::debug!("Proxying {} to {}", uri, target_uri_str);

    // Parse the target URI
    let target_uri = match target_uri_str.parse() {
        Ok(uri) => uri,
        Err(e) => {
            tracing::error!("Failed to parse target URI '{}': {}", target_uri_str, e);
            return (StatusCode::BAD_GATEWAY, "Invalid target URI").into_response();
        }
    };

    // Update request URI
    *req.uri_mut() = target_uri;

    // Clean headers for regular requests
    if !is_upgrade {
        let headers = req.headers_mut();
        for header in HOP_HEADERS {
            headers.remove(header);
        }
        headers.remove(header::HOST);
    }

    // Handle upgrade requests (WebSocket) differently
    if is_upgrade {
        return handle_upgrade(req, client, proxy_target.clone()).await;
    }

    // Forward regular HTTP request to Vite dev server
    match client.request(req).await {
        Ok(mut response) => {
            // Clean up response headers
            let response_headers = response.headers_mut();
            for header in HOP_HEADERS {
                response_headers.remove(header);
            }

            response.into_response()
        }
        Err(e) => {
            tracing::error!(
                "Proxy request failed: {} - Make sure the dev server is running on {}",
                e,
                proxy_target
            );
            (
                StatusCode::BAD_GATEWAY,
                format!("Proxy error: {}. Make sure dev server is running on {}", e, proxy_target)
            )
                .into_response()
        }
    }
}

async fn handle_upgrade(
    mut req: Request,
    client: Client<HttpConnector, Body>,
    proxy_target: String,
) -> Response {
    // Get the on_upgrade callback from the request before we send it
    let client_upgrade = hyper::upgrade::on(&mut req);

    // Forward the upgrade request to the backend
    match client.request(req).await {
        Ok(mut backend_response) => {
            // Check if backend accepted the upgrade
            if backend_response.status() == StatusCode::SWITCHING_PROTOCOLS {
                // Extract the upgrade handle before spawning
                let backend_upgrade = hyper::upgrade::on(&mut backend_response);

                // Spawn a task to handle both upgrades and tunnel them
                tokio::spawn(async move {
                    // Wait for both upgrades to complete
                    let (client_upgraded, backend_upgraded) =
                        tokio::join!(client_upgrade, backend_upgrade);

                    match (client_upgraded, backend_upgraded) {
                        (Ok(client), Ok(backend)) => {
                            tracing::debug!("Both sides upgraded, starting tunnel");
                            // Wrap upgraded connections in TokioIo for tokio compatibility
                            let client = TokioIo::new(client);
                            let backend = TokioIo::new(backend);
                            if let Err(e) = tunnel(client, backend).await {
                                tracing::error!("Tunnel error: {}", e);
                            }
                        }
                        (Err(e), _) => {
                            tracing::error!("Failed to upgrade client connection: {}", e);
                        }
                        (_, Err(e)) => {
                            tracing::error!("Failed to upgrade backend connection: {}", e);
                        }
                    }
                });

                // Return the upgrade response to the client
                backend_response.into_response()
            } else {
                // Backend didn't accept upgrade
                tracing::warn!(
                    "Backend refused upgrade with status: {}",
                    backend_response.status()
                );
                backend_response.into_response()
            }
        }
        Err(e) => {
            tracing::error!(
                "Failed to forward upgrade request: {} - Make sure dev server is running on {}",
                e,
                proxy_target
            );
            (
                StatusCode::BAD_GATEWAY,
                format!(
                    "Upgrade request failed: {}. Make sure dev server is running on {}",
                    e, proxy_target
                ),
            )
                .into_response()
        }
    }
}

async fn tunnel(
    mut client: TokioIo<Upgraded>,
    mut backend: TokioIo<Upgraded>,
) -> std::io::Result<()> {
    // Create a bidirectional tunnel between client and backend
    match copy_bidirectional(&mut client, &mut backend).await {
        Ok((from_client, from_backend)) => {
            tracing::debug!(
                "WebSocket tunnel closed: {} bytes from client, {} bytes from backend",
                from_client,
                from_backend
            );
            Ok(())
        }
        Err(e) => {
            tracing::error!("WebSocket tunnel error: {}", e);
            Err(e)
        }
    }
}
