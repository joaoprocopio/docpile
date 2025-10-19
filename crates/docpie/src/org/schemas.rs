use crate::org::models;
use serde::{Deserialize, Serialize};
use sqlx::Type;
use validator::Validate;

#[derive(Debug, Serialize, Deserialize)]
pub struct ReadOrg {
    pub name: String,
    pub status: OrgStatus,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateOrg {
    #[validate(length(min = 1, max = 64))]
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Type)]
#[sqlx(type_name = "org_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum OrgStatus {
    Active,
}

impl From<models::Org> for ReadOrg {
    fn from(value: models::Org) -> Self {
        Self {
            name: value.name,
            status: value.status,
        }
    }
}
