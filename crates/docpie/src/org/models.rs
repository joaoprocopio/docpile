use crate::org::schemas::{OrgMembershipRole, OrgMembershipStatus, OrgStatus};
use time::OffsetDateTime;

#[derive(Debug, Clone)]
pub struct Org {
    pub id: i32,
    pub name: String,
    pub status: OrgStatus,
    pub created_at: OffsetDateTime,
}

#[derive(Debug, Clone)]
pub struct OrgMembership {
    pub id: i32,
    pub user_id: i32,
    pub org_id: i32,
    pub status: OrgMembershipStatus,
    pub role: OrgMembershipRole,
    pub created_at: OffsetDateTime,
}
