use time::OffsetDateTime;

#[derive(Debug, Clone)]
pub struct Org {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub status: OrgStatus,
    pub created_at: OffsetDateTime,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[sqlx(type_name = "org_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum OrgStatus {
    Active,
}

#[derive(Debug, Clone)]
pub struct OrgMembership {
    pub id: i32,
    pub user_id: i32,
    pub org_id: i32,
    pub role: OrgMembershipRole,
    pub created_at: OffsetDateTime,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, sqlx::Type)]
#[sqlx(type_name = "org_membership_role", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum OrgMembershipRole {
    Member,
    Owner,
}
