use time::OffsetDateTime;

#[derive(Debug, Clone)]
pub struct User {
    pub id: i32,
    pub password: String,
    pub created_at: OffsetDateTime,
    pub email: String,
    pub display_name: String,
}
