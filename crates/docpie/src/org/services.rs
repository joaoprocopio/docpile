use crate::org::models;
use sqlx::{Pool, Sqlite};

#[derive(thiserror::Error, Debug)]
pub enum ListOrgsError {
    #[error(transparent)]
    SQLX(#[from] sqlx::Error),

    #[error(transparent)]
    STRParse(#[from] strum::ParseError),
}

pub async fn list_orgs(pool: &Pool<Sqlite>) -> Result<Vec<models::Org>, ListOrgsError> {
    let orgs = sqlx::query!("SELECT id, name, status FROM org")
        .map(|r| Ok(models::Org::new(r.id, r.name, r.status.parse()?)))
        .fetch_all(pool)
        .await?;

    orgs.into_iter().collect()
}
