use std::borrow::Cow;

use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::{Serialize, Serializer, ser::SerializeMap};

type CowStr = Cow<'static, str>;

#[derive(thiserror::Error, Debug)]
#[error("{status}: {title}")]
pub struct Problem {
    pub title: CowStr,
    pub status: StatusCode,

    #[source]
    pub source: anyhow::Error,
}

impl Problem {
    pub fn from_status(status: StatusCode) -> Self {
        let title = status.canonical_reason().unwrap_or("<none>");

        Self {
            title: title.into(),
            source: anyhow::Error::msg(title),
            status: status,
        }
    }
}

impl IntoResponse for Problem {
    fn into_response(self) -> Response {
        (self.status, Json(&self)).into_response()
    }
}

impl Serialize for Problem {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut map = serializer.serialize_map(None)?;

        map.serialize_entry(&"status", &self.status.as_u16())?;
        map.serialize_entry(&"title", &self.title)?;

        map.end()
    }
}
