use crate::server::state::ServerEnv;
use std::str::FromStr;

#[derive(thiserror::Error, Debug)]
pub enum CreateDBPoolError {
    #[error(transparent)]
    SQLX(#[from] sqlx::Error),
}

pub async fn create_db_pool(env: &ServerEnv) -> Result<DbPool, CreateDBPoolError> {
    let pool = DbPoolOptions::new();
    let connect = DbConnectOptions::from_str(&env.db_url)?
        .journal_mode(DbJournalMode::Wal)
        .synchronous(DbSynchronous::Normal)
        .create_if_missing(true)
        .foreign_keys(true);

    Ok(pool.connect_with(connect).await?)
}

pub type DbPool = sqlx::sqlite::SqlitePool;
pub type DbPoolOptions = sqlx::sqlite::SqlitePoolOptions;
pub type DbConnectOptions = sqlx::sqlite::SqliteConnectOptions;
pub type DbJournalMode = sqlx::sqlite::SqliteJournalMode;
pub type DbSynchronous = sqlx::sqlite::SqliteSynchronous;
