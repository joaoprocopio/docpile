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

#[derive(Debug, Serialize, Deserialize)]
pub struct SafeUser {
    pub email: String,
    pub display_name: String,
}

impl From<User> for SafeUser {
    fn from(value: User) -> Self {
        Self {
            email: value.email,
            display_name: value.display_name,
        }
    }
}
