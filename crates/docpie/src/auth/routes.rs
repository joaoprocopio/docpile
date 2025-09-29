use crate::{auth::models::User, server::config::Server};
use axum::{Json, extract::State};
use chrono::Utc;

pub async fn sign_in(State(state): State<Server>) -> Json<User> {
    let _ = sqlx::query("SELECT $1")
        .bind(150)
        .fetch_one(&state.db)
        .await
        .unwrap();

    let user = User {
        id: 1,
        email: "joao@gmail.com".to_string(),
        password: "password123".to_string(),
        joined_at: Utc::now(),
    };

    Json(user)
}
