use crate::org::models::Org;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Serialize, Deserialize)]
pub struct ReadOrg {
    pub name: String,
    pub slug: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ReadResolvedInvitation {
    pub inviter_name: String,
    pub org_name: String,
    pub invite_token: Uuid,
}

impl ReadResolvedInvitation {
    pub fn new(inviter_name: String, org_name: String, invite_token: Uuid) -> Self {
        Self {
            inviter_name,
            org_name,
            invite_token,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateOrg {
    #[validate(length(min = 1, max = 64))]
    pub name: String,

    #[validate(length(min = 3, max = 256))]
    pub slug: String,
}

impl From<Org> for ReadOrg {
    fn from(value: Org) -> Self {
        Self {
            name: value.name,
            slug: value.slug,
        }
    }
}
