use serde::{Deserialize, Serialize};
use std::str::FromStr;

#[derive(Debug, Serialize, Deserialize)]
pub struct Org {
    pub id: i64,
    pub name: String,
    pub status: OrgStatus,
}

#[derive(thiserror::Error, Debug)]
pub enum OrgStatusError {
    #[error("unknown status")]
    UnknownStatus,
}

#[derive(Debug)]
pub enum OrgStatus {
    Active,
}

impl OrgStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            OrgStatus::Active => "active",
        }
    }
}

impl FromStr for OrgStatus {
    type Err = OrgStatusError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "active" => Ok(OrgStatus::Active),
            _ => Err(OrgStatusError::UnknownStatus),
        }
    }
}

impl From<String> for OrgStatus {
    fn from(s: String) -> Self {
        OrgStatus::from_str(&s).unwrap_or(OrgStatus::Active)
    }
}

impl Serialize for OrgStatus {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.as_str())
    }
}

impl<'de> Deserialize<'de> for OrgStatus {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        OrgStatus::from_str(&s).map_err(serde::de::Error::custom)
    }
}
