use crate::server::state::ServerEnv;
use sqlx::{
    PgPool,
    postgres::{PgConnectOptions, PgPoolOptions},
};
use std::str::FromStr;

#[derive(thiserror::Error, Debug)]
pub enum CreateDBPoolError {
    #[error(transparent)]
    SQLX(#[from] sqlx::Error),
}

pub async fn create_db_pool(env: &ServerEnv) -> Result<PgPool, CreateDBPoolError> {
    let pool = PgPoolOptions::new();
    let connect = PgConnectOptions::from_str(&env.db_url)?;

    Ok(pool.connect_with(connect).await?)
}
