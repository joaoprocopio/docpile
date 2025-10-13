use crate::org::schemas;

#[derive(Debug)]
pub struct Org {
    pub id: i64,
    pub name: String,
    pub status: schemas::OrgStatus,
}
