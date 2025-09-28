use crate::config::ServerEnv;

pub type DbPool = sqlx::sqlite::SqlitePool;
pub type DbPoolOptions = sqlx::sqlite::SqlitePoolOptions;

pub async fn create_db_pool(env: &ServerEnv) -> crate::Result<DbPool> {
    let opts = DbPoolOptions::new();

    Ok(opts.connect(&env.db_url).await?)
}
