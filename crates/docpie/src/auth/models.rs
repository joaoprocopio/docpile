use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub(crate) id: i64,
    pub(crate) password: String,
    pub(crate) created_at: DateTime<Utc>,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
}
