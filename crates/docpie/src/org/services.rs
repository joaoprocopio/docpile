use time::OffsetDateTime;
use uuid::Uuid;

use crate::{
    auth::models::User,
    error::Result,
    http::config::Server,
    org::{
        models::{Org, OrgMembership, OrgMembershipRole, OrgStatus},
        schemas::CreateOrg,
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
        "#,
        user.id,
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
        INSERT INTO org_membership (user_id, org_id, role, created_at, invite_token)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, user_id, org_id, role AS "role: OrgMembershipRole", created_at
        "#,
        user.id,
        org.id,
        OrgMembershipRole::Owner as OrgMembershipRole,
        OffsetDateTime::now_utc(),
        Uuid::now_v7()
    )
    .fetch_one(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(org)
}

pub async fn get_invite_token(
    server: &Server,
    user: User,
    org_slug: String,
) -> Result<Option<Uuid>> {
    let invite_token = sqlx::query!(
        r#"
        SELECT om.invite_token FROM orgs AS o
        JOIN org_membership AS om
        ON om.org_id = o.id
        WHERE o.slug = $1
        AND om.user_id = $2
        "#,
        org_slug,
        user.id
    )
    .map(|r| r.invite_token)
    .fetch_one(&server.db)
    .await?;

    Ok(invite_token)
}

pub async fn rotate_invite_token(server: &Server, user: User, org_slug: String) -> Result<Uuid> {
    let invite_token = sqlx::query!(
        r#"
        UPDATE org_membership AS om
        SET invite_token = $3
        FROM orgs AS o
        WHERE om.org_id = o.id
        AND o.slug = $1
        AND om.user_id = $2
        RETURNING om.invite_token AS "invite_token!"
        "#,
        org_slug,
        user.id,
        Uuid::now_v7()
    )
    .map(|r| r.invite_token)
    .fetch_one(&server.db)
    .await?;

    Ok(invite_token)
}
