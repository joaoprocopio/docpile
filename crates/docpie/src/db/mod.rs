use crate::server::StateEnv;

pub type DbPool = sqlx::sqlite::SqlitePool;
pub type DbPoolOptions = sqlx::sqlite::SqlitePoolOptions;

pub async fn create_db_pool(env: &StateEnv) -> crate::Result<DbPool> {
    let opts = DbPoolOptions::new();

    Ok(opts.connect(&env.db_url).await?)
}
