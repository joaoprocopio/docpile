use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;
use std::borrow::Cow;

pub use anyhow::Error as AnyError;
pub use anyhow::anyhow as anyerror;

pub type Result<T, E = AnyError> = std::result::Result<T, E>;

type CowStr = Cow<'static, str>;

#[derive(thiserror::Error, Debug, Serialize)]
#[error("{cause}")]
pub struct Error {
    #[source]
    #[serde(skip)]
    pub cause: AnyError,

    #[serde(serialize_with = "serialize_status")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<StatusCode>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub code: Option<CowStr>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<CowStr>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<CowStr>,
}

fn serialize_status<S>(status: &Option<StatusCode>, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    match status {
        Some(status) => serializer.serialize_u16(status.as_u16()),
        None => serializer.serialize_none(),
    }
}

impl Error {
    pub fn new(cause: impl Into<AnyError>) -> Self {
        Self {
            cause: cause.into(),
            code: None,
            status: None,
            title: None,
            details: None,
        }
    }

    pub fn from_status(status: impl TryInto<StatusCode>, cause: impl Into<AnyError>) -> Self {
        let status: StatusCode = status.try_into().unwrap_or(StatusCode::IM_A_TEAPOT);
        let title = status.canonical_reason().unwrap_or("<none>");

        Self::new(cause).with_status(status).with_title(title)
    }
}

impl Error {
    pub fn with_cause(mut self, cause: impl Into<AnyError>) -> Self {
        self.cause = cause.into();
        self
    }

    pub fn with_code(mut self, code: impl Into<CowStr>) -> Self {
        self.code = Some(code.into());
        self
    }

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
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        tracing::error!(?self);

        match self.status {
            Some(status) => (status, Json(&self)).into_response(),
            None => Json(&self).into_response(),
        }
    }
}
