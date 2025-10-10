use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::{Serialize, Serializer, ser::SerializeMap};
use std::{borrow::Cow, collections::HashMap, error::Error};

type CowStr = Cow<'static, str>;

#[derive(thiserror::Error, Debug)]
#[error("problem")] // TODO: impl Display
pub struct Problem {
    pub status: Option<StatusCode>,
    pub title: Option<CowStr>,
    pub details: Option<CowStr>,
    pub context: Option<Context>,

    #[source]
    pub source: Option<anyhow::Error>,
}

impl Problem {
    pub fn from_status(status: StatusCode) -> Self {
        let title = status.canonical_reason().unwrap_or("<none>");

        Self {
            status: Some(status),
            title: Some(title.into()),
            details: None,
            context: None,
            source: None,
        }
    }
}

impl Problem {
    pub fn with_status(mut self, status: impl Into<StatusCode>) -> Self {
        self.status = Some(status.into());
        self
    }

    pub fn with_title(mut self, title: impl Into<CowStr>) -> Self {
        self.title = Some(title.into());
        self
    }

    pub fn with_details(mut self, details: impl Into<CowStr>) -> Self {
        self.details = Some(details.into());
        self
    }

    pub fn with_source<E: Error + Send + Sync + 'static>(mut self, source: E) -> Self {
        self.source = Some(source.into());
        self
    }
}

impl Serialize for Problem {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut map = serializer.serialize_map(None)?;

        if let Some(status) = &self.status {
            map.serialize_entry(&"status", &status.as_u16())?;
        }

        if let Some(title) = &self.title {
            map.serialize_entry(&"title", title)?;
        }

        if let Some(details) = &self.details {
            map.serialize_entry(&"details", details)?;
        }

        map.end()
    }
}

impl IntoResponse for Problem {
    fn into_response(self) -> Response {
        match self.status {
            Some(status) => (status, Json(&self)).into_response(),
            None => Json(&self).into_response(),
        }
    }
}

#[derive(Debug, Serialize)]
#[serde(transparent)]
pub struct Context(HashMap<CowStr, serde_json::Value>);
