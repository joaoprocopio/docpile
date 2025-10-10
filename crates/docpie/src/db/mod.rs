use crate::{error::Result, server::state::ServerEnv};
use sqlx::{
    PgPool,
    postgres::{PgConnectOptions, PgPoolOptions},
};
use std::str::FromStr;

pub async fn create_db_pool(env: &ServerEnv) -> Result<PgPool> {
    let pool = PgPoolOptions::new();
    let connect = PgConnectOptions::from_str(&env.db_url)?;

    Ok(pool.connect_with(connect).await?)
}
