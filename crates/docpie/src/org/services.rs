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
    let orgs: Result<Vec<models::Org>, strum::ParseError> = sqlx::query!("SELECT * FROM org")
        .map(|r| Ok(models::Org::new(r.id, r.name.clone(), r.status.parse()?)))
        .fetch_all(pool)
        .await?
        .into_iter()
        .collect();

    Ok(orgs?)
}
