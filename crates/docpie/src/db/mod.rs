use crate::server::state::ServerEnv;
use sqlx::{
    SqlitePool,
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous},
};
use std::str::FromStr;

#[derive(thiserror::Error, Debug)]
pub enum CreateDBPoolError {
    #[error(transparent)]
    SQLX(#[from] sqlx::Error),
}

pub async fn create_db_pool(env: &ServerEnv) -> Result<SqlitePool, CreateDBPoolError> {
    let pool = SqlitePoolOptions::new();
    let connect = SqliteConnectOptions::from_str(&env.db_url)?
        .journal_mode(SqliteJournalMode::Wal)
        .synchronous(SqliteSynchronous::Normal)
        .create_if_missing(true)
        .foreign_keys(true);

    Ok(pool.connect_with(connect).await?)
}
