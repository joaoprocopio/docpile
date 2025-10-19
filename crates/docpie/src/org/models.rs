use crate::org::schemas;

#[derive(Debug)]
pub struct Org {
    pub id: i32,
    pub name: String,
    pub status: schemas::OrgStatus,
}
