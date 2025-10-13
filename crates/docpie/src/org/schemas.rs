use serde::{Deserialize, Serialize};
use sqlx::Type;

use crate::org::models;

#[derive(Debug, Serialize, Deserialize)]
pub struct Org {
    pub name: String,
    pub status: OrgStatus,
}

#[derive(Debug, Serialize, Deserialize, Type)]
#[sqlx(type_name = "org_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum OrgStatus {
    Active,
}

impl From<models::Org> for Org {
    fn from(value: models::Org) -> Self {
        Self {
            name: value.name,
            status: value.status,
        }
    }
}
