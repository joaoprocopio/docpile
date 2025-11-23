use time::OffsetDateTime;

use crate::{
    auth::models::User,
    error::Result,
    http::config::Server,
    org::{
        models::{Org, OrgMembership, OrgMembershipRole, OrgMembershipStatus, OrgStatus},
        schemas::{CreateOrg, InviteMember},
    },
};

pub async fn list_membered_orgs(server: &Server, user: User) -> Result<Vec<Org>> {
    let orgs = sqlx::query_as!(
        Org,
        r#"
        SELECT o.id, o.name, o.slug, o.status AS "status: OrgStatus", o.created_at
        FROM orgs AS o
        JOIN org_membership AS om
            ON om.org_id = o.id
        WHERE om.user_id = $1
        AND om.status = $2
        "#,
        user.id,
        OrgMembershipStatus::Accepted as OrgMembershipStatus
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
        INSERT INTO orgs (name, slug, status, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, slug, status AS "status: OrgStatus", created_at
        "#,
        org_to_create.name,
        org_to_create.slug,
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

pub async fn create_invites(
    server: &Server,
    org_slug: String,
    invites_to_create: Vec<InviteMember>,
) {
    let res = sqlx::query!(
        r#"
        WITH org_to_insert AS (
            SELECT o.id
            FROM orgs AS o
            WHERE o.slug = $1
            LIMIT 1
        )

        select * from org_to_insert
        "#,
        org_slug,
    )
    .fetch_one(&server.db)
    .await
    .unwrap();

    dbg!(res);
}
