use serde::{Deserialize, Serialize};
use time::OffsetDateTime;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: i64,
    pub password: String,
    pub created_at: OffsetDateTime,
    pub email: String,
    pub display_name: String,
}
