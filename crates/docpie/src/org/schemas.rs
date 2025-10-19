use crate::org::models;
use serde::{Deserialize, Serialize};
use sqlx::Type;
use validator::Validate;

#[derive(Debug, Serialize, Deserialize)]
pub struct ReadOrg {
    pub name: String,
    pub slug: String,
    pub status: OrgStatus,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateOrg {
    #[validate(length(min = 1, max = 64))]
    pub name: String,

    #[validate(length(min = 1, max = 256))]
    pub slug: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
#[sqlx(type_name = "org_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum OrgStatus {
    Active,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
#[sqlx(type_name = "org_membership_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum OrgMembershipStatus {
    Pending,
    Accepted,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
#[sqlx(type_name = "org_membership_role", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum OrgMembershipRole {
    Member,
    Owner,
}

impl From<models::Org> for ReadOrg {
    fn from(value: models::Org) -> Self {
        Self {
            name: value.name,
            slug: value.slug,
            status: value.status,
        }
    }
}
