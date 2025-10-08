use crate::{
    org::models::{Org, OrgStatus},
    server::state::Server,
};

#[derive(thiserror::Error, Debug)]
pub enum ListOrgsError {
    #[error(transparent)]
    SQLX(#[from] sqlx::Error),

    #[error(transparent)]
    STRParse(#[from] strum::ParseError),
}

pub async fn list_all_orgs(server: &Server) -> Result<Vec<Org>, ListOrgsError> {
    let orgs = sqlx::query_as!(
        Org,
        r#"SELECT id, name, status as "status: OrgStatus" FROM orgs"#
    )
    .fetch_all(&server.db)
    .await?;

    Ok(orgs)
}
