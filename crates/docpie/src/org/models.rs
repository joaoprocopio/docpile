use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Org {
    pub id: i64,
    pub name: String,
    pub status: OrgStatus,
}

impl Org {
    pub fn new(id: i64, name: String, status: OrgStatus) -> Self {
        Self { id, name, status }
    }
}

#[derive(Debug, Serialize, Deserialize, strum::EnumString, strum::AsRefStr)]
#[strum(serialize_all = "lowercase")]
pub enum OrgStatus {
    Active,
}
