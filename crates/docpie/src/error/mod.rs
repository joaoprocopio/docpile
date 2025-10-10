use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;
use std::{borrow::Cow, collections::HashMap, fmt::Debug};

pub use anyhow::Error as AnyError;
pub use anyhow::anyhow as anyerror;
pub type Result<T, E = AnyError> = std::result::Result<T, E>;

pub type AnyJson = serde_json::Value;
pub type CowStr = Cow<'static, str>;
pub type Context<CV = AnyJson> = HashMap<CowStr, CV>; // CV stands for Context Value

#[derive(thiserror::Error, Debug, Serialize)]
#[error("{cause}")]
pub struct Error<CV: Serialize + Debug = AnyJson> {
    #[source]
    #[serde(skip)]
    pub cause: AnyError,

    #[serde(skip_serializing_if = "Context::is_empty")]
    pub context: Context<CV>,

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

impl<CV: Serialize + Debug> Error<CV> {
    pub fn new(cause: impl Into<AnyError>) -> Self {
        Self {
            cause: cause.into(),
            context: Context::new(),
            code: None,
            status: None,
            title: None,
            details: None,
        }
    }

    pub fn from_status(status: impl TryInto<StatusCode>, cause: impl Into<AnyError>) -> Self {
        let status: StatusCode = status.try_into().unwrap_or(StatusCode::IM_A_TEAPOT);
        let title = status.canonical_reason().unwrap_or("<none>");

        Self::new(cause)
            .with_status(Some(status))
            .with_title(Some(title))
    }
}

impl<CV: Serialize + Debug> Error<CV> {
    pub fn with_cause(mut self, cause: impl Into<AnyError>) -> Self {
        self.cause = cause.into();
        self
    }

    pub fn with_context(mut self, context: Context<CV>) -> Self {
        self.context = context;
        self
    }

    pub fn with_code(mut self, code: Option<impl Into<CowStr>>) -> Self {
        self.code = code.and_then(|c| Some(c.into()));
        self
    }

    pub fn with_status(mut self, status: Option<impl Into<StatusCode>>) -> Self {
        self.status = status.and_then(|s| Some(s.into()));
        self
    }

    pub fn with_title(mut self, title: Option<impl Into<CowStr>>) -> Self {
        self.title = title.and_then(|t| Some(t.into()));
        self
    }

    pub fn with_details(mut self, details: Option<impl Into<CowStr>>) -> Self {
        self.details = details.and_then(|d| Some(d.into()));
        self
    }
}

impl<CV: Serialize + Debug> IntoResponse for Error<CV> {
    fn into_response(self) -> Response {
        tracing::error!(?self);

        match self.status {
            Some(status) => (status, Json(&self)).into_response(),
            None => Json(&self).into_response(),
        }
    }
}
