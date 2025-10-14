use crate::{auth::models::User, error::Result, http::state::Server};
use password_auth::generate_hash;
use time::OffsetDateTime;

pub async fn get_user_by_id(server: &Server, user_id: i32) -> Result<Option<User>> {
    let user = sqlx::query_as!(
        User,
        r#"
        SELECT
            id,
            email,
            password,
            display_name,
            created_at
        FROM users
        WHERE id = $1
        "#,
        user_id
    )
    .fetch_optional(&server.db)
    .await?;

    Ok(user)
}

pub async fn get_user_by_email(server: &Server, email: String) -> Result<Option<User>> {
    let user = sqlx::query_as!(
        User,
        r#"
        SELECT
            id,
            email,
            password,
            display_name,
            created_at
        FROM users
        WHERE email = $1
        "#,
        email
    )
    .fetch_optional(&server.db)
    .await?;

    Ok(user)
}

pub async fn check_email_taken(server: &Server, email: &String) -> Result<bool> {
    let is_taken = sqlx::query!(
        r#"
        SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) AS "exists!"
        "#,
        email
    )
    .map(|r| r.exists)
    .fetch_one(&server.db)
    .await?;

    Ok(is_taken)
}

pub async fn create_user(
    server: &Server,
    email: &String,
    password: &String,
    display_name: &String,
) -> Result<User> {
    let password = password.to_owned();
    let password = server
        .handle
        .spawn_blocking(move || generate_hash(password))
        .await?;

    let user = sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (email, password, display_name, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, password, display_name, created_at
        "#,
        email,
        password,
        display_name,
        OffsetDateTime::now_utc()
    )
    .fetch_one(&server.db)
    .await?;

    Ok(user)
}
