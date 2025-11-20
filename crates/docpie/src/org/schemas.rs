use crate::org::models::{Org, OrgMembershipRole, OrgStatus};
use serde::{Deserialize, Serialize};
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

    #[validate(length(min = 3, max = 256))]
    pub slug: String,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct InviteMember {
    #[validate(email, length(max = 320))]
    pub email: String,
    pub role: OrgMembershipRole,
}

impl From<Org> for ReadOrg {
    fn from(value: Org) -> Self {
        Self {
            name: value.name,
            slug: value.slug,
            status: value.status,
        }
    }
}
