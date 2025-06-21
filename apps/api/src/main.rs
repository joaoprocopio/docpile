use axum::{Router, routing::get};
use tokio::net::TcpListener;

async fn hello() -> String {
    String::from("hello, world!")
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(hello));
    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();

    println!("abcasdfd listenasdfasdfasdfasdfaasdfsdf aaaaaaaaaaaaaaa");

    axum::serve(listener, app).await.unwrap();
}
