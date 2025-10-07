use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct SignUp {
    #[validate(email, length(max = 320))]
    pub email: String,

    #[validate(length(min = 8, max = 256))]
    pub password: String,

    #[validate(length(max = 128))]
    pub first_name: String,

    #[validate(length(max = 128))]
    pub last_name: String,
}
