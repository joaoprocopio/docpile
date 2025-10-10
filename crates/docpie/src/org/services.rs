use crate::{
    org::models::{Org, OrgStatus},
    problem::AnyError,
    server::state::Server,
};

pub async fn list_all_orgs(server: &Server) -> Result<Vec<Org>, AnyError> {
    let orgs = sqlx::query_as!(
        Org,
        r#"SELECT id, name, status as "status: OrgStatus" FROM orgs"#
    )
    .fetch_all(&server.db)
    .await?;

    Err(sqlx::Error::WorkerCrashed)?;

    Ok(orgs)
}
