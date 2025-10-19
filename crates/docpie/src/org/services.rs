use crate::{
    auth::models::User,
    error::Result,
    http::config::Server,
    org::{
        models::Org,
        schemas::{self, OrgStatus},
    },
};

pub async fn list_membered_orgs(server: &Server, user: User) -> Result<Vec<Org>> {
    let orgs = sqlx::query_as!(
        Org,
        r#"
        SELECT o.id, o.name, o.status AS "status: OrgStatus"
        FROM orgs AS o
        JOIN org_membership AS om
            ON om.org_id = o.id
        WHERE om.user_id = $1
        "#,
        user.id
    )
    .fetch_all(&server.db)
    .await?;

    Ok(orgs)
}

pub async fn create_org(server: &Server, org: schemas::CreateOrg, user: User) -> Result<Org> {
    // let tx = server.db.begin().await?;
    // let org = sqlx::query_as!(Org, r#"$1"#, user.id);
    // tx.commit().await?;

    Ok(Org {
        id: 1,
        name: "abc".into(),
        status: OrgStatus::Active,
    })
}
