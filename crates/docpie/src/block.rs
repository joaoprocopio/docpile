#![allow(dead_code)]
use uuid::Uuid;

pub struct Block<K: for<'a> Kind<'a>> {
    id: Uuid,
    children: Vec<Uuid>,
    parent: Option<Uuid>,
    kind: K,
}

pub enum BlockKind<'a> {
    Paragraph(&'a Paragraph),
}

pub trait Kind<'a> {
    fn kind(&'a self) -> BlockKind<'a>;
}

pub struct Paragraph {
    pub text: String,
}

impl<'a> Kind<'a> for Paragraph {
    fn kind(&'a self) -> BlockKind<'a> {
        BlockKind::Paragraph(self)
    }
}

pub enum ListKind {
    Ordered,
    Unordered,
}

pub struct List {
    pub items: Vec<String>,
    pub kind: ListKind,
}
