pub struct Org {
    pub id: i64,
    pub name: String,
    pub status: OrgStatus,
}

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
