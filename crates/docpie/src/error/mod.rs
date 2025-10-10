use axum::http::StatusCode;
use serde::ser::SerializeMap;
use std::{borrow::Cow, collections::HashMap};

type CowStr = Cow<'static, str>;

pub type Extensions = HashMap<CowStr, serde_json::Value>;

#[derive(Debug)]
pub struct Error {
    r#type: CowStr,
    title: CowStr,
    details: CowStr,
    status: StatusCode,
    extensions: Extensions,
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut map = serializer.serialize_map(None)?;

        map.serialize_entry(&"status", &self.status.as_u16())?;

        map.end()
    }
}
