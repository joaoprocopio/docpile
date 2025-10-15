use axum::response::Html;

#[cfg(debug_assertions)]
pub async fn spa() -> Html<&'static str> {
    Html("<html><body><h1>Hello world!</h1></body></html>")
}
