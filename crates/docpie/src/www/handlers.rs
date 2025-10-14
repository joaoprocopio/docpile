use axum::response::Html;

pub async fn spa() -> Html<&'static str> {
    Html("<html><body><h1>Hello world!</h1></body></html>")
}
