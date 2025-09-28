use crate::auth::models::User;
use axum::Json;
use chrono::Utc;

pub async fn sign_in() -> Json<User> {
    let user = User {
        id: 1,
        email: "joao@gmail.com".to_string(),
        password: "password123".to_string(),
        joined_at: Utc::now(),
    };

    Json(user)
}
