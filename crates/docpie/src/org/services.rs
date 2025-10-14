use crate::{
    error::Result,
    http::config::Server,
    org::{models::Org, schemas::OrgStatus},
};

pub async fn list_all_orgs(server: &Server) -> Result<Vec<Org>> {
    let orgs = sqlx::query_as!(
        Org,
        r#"SELECT id, name, status as "status: OrgStatus" FROM orgs"#
    )
    .fetch_all(&server.db)
    .await?;

    Ok(orgs)
}
