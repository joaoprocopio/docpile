use crate::auth::models;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct SignUp {
    #[validate(email, length(max = 320))]
    pub email: String,

    #[validate(length(min = 8, max = 256))]
    pub password: String,

    #[validate(length(min = 1, max = 256))]
    pub display_name: String,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct SignIn {
    #[validate(email, length(max = 320))]
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub email: String,
    pub display_name: String,
}

impl From<models::User> for User {
    fn from(value: models::User) -> Self {
        Self {
            email: value.email,
            display_name: value.display_name,
        }
    }
}
