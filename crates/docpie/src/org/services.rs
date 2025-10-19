use time::OffsetDateTime;

use crate::{
    auth::models::User,
    error::Result,
    http::config::Server,
    org::{
        models::{Org, OrgMembership},
        schemas::{CreateOrg, OrgMembershipRole, OrgMembershipStatus, OrgStatus},
    },
};

pub async fn list_membered_orgs(server: &Server, user: User) -> Result<Vec<Org>> {
    let orgs = sqlx::query_as!(
        Org,
        r#"
        SELECT o.id, o.name, o.status AS "status: OrgStatus", o.created_at
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

pub async fn create_org(server: &Server, org_to_create: CreateOrg, user: User) -> Result<Org> {
    let mut tx = server.db.begin().await?;

    let org = sqlx::query_as!(
        Org,
        r#"
        INSERT INTO orgs (name, status, created_at)
        VALUES ($1, $2, $3)
        RETURNING id, name, status AS "status: OrgStatus", created_at
        "#,
        org_to_create.name,
        OrgStatus::Active as OrgStatus,
        OffsetDateTime::now_utc()
    )
    .fetch_one(&mut *tx)
    .await?;

    let _ = sqlx::query_as!(
        OrgMembership,
        r#"
        INSERT INTO org_membership (user_id, org_id, status, role, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, user_id, org_id, status AS "status: OrgMembershipStatus", role AS "role: OrgMembershipRole", created_at
        "#,
        user.id,
        org.id,
        OrgMembershipStatus::Accepted as OrgMembershipStatus,
        OrgMembershipRole::Owner as OrgMembershipRole,
        OffsetDateTime::now_utc()
    )
    .fetch_one(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(org)
}
