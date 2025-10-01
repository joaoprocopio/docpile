pub struct Org {
    id: i64,
    name: String,
    status: OrgStatus,
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
