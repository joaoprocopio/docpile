use crate::org::models::{Org, OrgStatus};
use sqlx::{Pool, Postgres};

#[derive(thiserror::Error, Debug)]
pub enum ListOrgsError {
    #[error(transparent)]
    SQLX(#[from] sqlx::Error),

    #[error(transparent)]
    STRParse(#[from] strum::ParseError),
}

pub async fn list_orgs(pool: &Pool<Postgres>) -> Result<Vec<Org>, ListOrgsError> {
    let orgs = sqlx::query_as!(
        Org,
        r#"SELECT id, name, status as "status: OrgStatus" FROM orgs"#
    )
    .fetch_all(pool)
    .await;

    orgs.map_err(|err| err.into())
}
