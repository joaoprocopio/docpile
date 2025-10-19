use crate::{
    error::Result,
    http::config::Server,
    org::{models::Org, schemas::OrgStatus},
};

pub async fn list_membered_orgs(server: &Server, user_id: i32) -> Result<Vec<Org>> {
    let orgs = sqlx::query_as!(
        Org,
        r#"
        SELECT o.id, o.name, o.status AS "status: OrgStatus"
        FROM orgs AS o
        JOIN org_membership AS om
            ON om.org_id = o.id
        WHERE om.user_id = $1
        "#,
        user_id
    )
    .fetch_all(&server.db)
    .await?;

    Ok(orgs)
}
