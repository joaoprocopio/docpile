use crate::{auth::models::User, server::state::Server};
use axum_login::{AuthUser, AuthnBackend};
use password_auth::verify_password;

pub struct Credentials {
    email: String,
    password: String,
}

pub type AuthSession = axum_login::AuthSession<Server>;

impl AuthUser for User {
    type Id = i64;

    fn id(&self) -> Self::Id {
        self.id
    }

    fn session_auth_hash(&self) -> &[u8] {
        self.password.as_bytes()
    }
}

#[derive(thiserror::Error, Debug)]
pub enum AuthnError {
    #[error(transparent)]
    SQLX(#[from] sqlx::Error),

    #[error(transparent)]
    TokioJoin(#[from] tokio::task::JoinError),
}

impl AuthnBackend for Server {
    type User = User;
    type Credentials = Credentials;
    type Error = AuthnError;

    async fn authenticate(
        &self,
        creds: Self::Credentials,
    ) -> Result<Option<Self::User>, Self::Error> {
        let user = sqlx::query_as!(User, r#"SELECT * FROM users WHERE email = $1"#, creds.email)
            .fetch_optional(&self.db)
            .await?;

        self.handle
            .spawn_blocking(|| {
                Ok(user.filter(|user| verify_password(creds.password, &user.password).is_ok()))
            })
            .await?
    }

    async fn get_user(
        &self,
        user_id: &axum_login::UserId<Self>,
    ) -> Result<Option<Self::User>, Self::Error> {
        let user = sqlx::query_as!(
            User,
            r#"SELECT * FROM users WHERE id = $1"#,
            *user_id as i32
        )
        .fetch_optional(&self.db)
        .await?;

        Ok(user)
    }
}
