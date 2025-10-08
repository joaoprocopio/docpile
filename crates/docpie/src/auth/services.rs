use crate::{auth::models::User, server::state::Server};
use password_auth::generate_hash;
use time::OffsetDateTime;

#[derive(thiserror::Error, Debug)]
pub enum CreateUserError {
    #[error(transparent)]
    SQLX(#[from] sqlx::Error),

    #[error(transparent)]
    TokioJoin(#[from] tokio::task::JoinError),
}

#[derive(thiserror::Error, Debug)]
pub enum GetUserError {
    #[error(transparent)]
    SQLX(#[from] sqlx::Error),
}

#[derive(thiserror::Error, Debug)]
pub enum EmailTakenError {
    #[error(transparent)]
    SQLX(#[from] sqlx::Error),
}

pub async fn get_user_by_id(server: &Server, user_id: i32) -> Result<Option<User>, GetUserError> {
    let user = sqlx::query_as!(
        User,
        r#"
        SELECT
            id,
            email,
            password,
            first_name,
            last_name,
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

pub async fn get_user_by_email(
    server: &Server,
    email: String,
) -> Result<Option<User>, GetUserError> {
    let user = sqlx::query_as!(
        User,
        r#"
        SELECT
            id,
            email,
            password,
            first_name,
            last_name,
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

pub async fn check_email_taken(server: &Server, email: &String) -> Result<bool, EmailTakenError> {
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
    first_name: &String,
    last_name: &String,
) -> Result<User, CreateUserError> {
    let password = password.to_owned();
    let password = server
        .handle
        .spawn_blocking(move || generate_hash(password))
        .await?;

    let user = sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (email, password, first_name, last_name, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, password, first_name, last_name, created_at
        "#,
        email,
        password,
        first_name,
        last_name,
        OffsetDateTime::now_utc()
    )
    .fetch_one(&server.db)
    .await?;

    Ok(user)
}
