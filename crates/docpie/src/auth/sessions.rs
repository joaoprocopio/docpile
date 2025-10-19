use crate::{
    auth::{
        models::User,
        schemas::SignIn,
        services::{get_user_by_email, get_user_by_id},
    },
    error::AnyError,
    http::config::Server,
};
use axum_login::{AuthUser, AuthnBackend};
use password_auth::verify_password;

pub type AuthSession = axum_login::AuthSession<Server>;

#[derive(thiserror::Error, Debug)]
pub enum AuthnError {
    #[error(transparent)]
    SQLX(#[from] sqlx::Error),

    #[error(transparent)]
    TaskJoin(#[from] tokio::task::JoinError),

    #[error(transparent)]
    Any(#[from] AnyError),
}

impl AuthUser for User {
    type Id = i32;

    fn id(&self) -> Self::Id {
        self.id
    }

    fn session_auth_hash(&self) -> &[u8] {
        self.password.as_bytes()
    }
}

impl AuthnBackend for Server {
    type User = User;
    type Credentials = SignIn;
    type Error = AuthnError;

    async fn authenticate(
        &self,
        creds: Self::Credentials,
    ) -> Result<Option<Self::User>, Self::Error> {
        let user = get_user_by_email(self, creds.email).await?;

        self.handle
            .spawn_blocking(move || {
                Ok(user.filter(|user| verify_password(creds.password, &user.password).is_ok()))
            })
            .await?
    }

    async fn get_user(
        &self,
        user_id: &axum_login::UserId<Self>,
    ) -> Result<Option<Self::User>, Self::Error> {
        Ok(get_user_by_id(self, *user_id).await?)
    }
}
