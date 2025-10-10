use crate::error::Error;
use axum::{
    Json,
    extract::{FromRequest, Request, rejection::JsonRejection},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::de::DeserializeOwned;
use validator::Validate;

pub struct Valid<T>(pub T);

#[derive(thiserror::Error, Debug)]
pub enum ValidJsonError {
    #[error(transparent)]
    Validation(#[from] validator::ValidationError),

    #[error(transparent)]
    ValidationMultiple(#[from] validator::ValidationErrors),

    #[error(transparent)]
    Json(#[from] JsonRejection),
}

impl IntoResponse for ValidJsonError {
    fn into_response(self) -> Response {
        match self {
            ValidJsonError::Json(err) => {
                let title = err.body_text();
                let status = err.status();

                Error::<serde_json::Value>::new(err)
                    .with_title(Some(title))
                    .with_status(Some(status))
                    .into_response()
            }
            ValidJsonError::Validation(outer_err) => Error::new(outer_err.to_owned())
                .with_status(Some(StatusCode::BAD_REQUEST))
                .with_code(Some(outer_err.code))
                .with_title(outer_err.message)
                .with_context(outer_err.params)
                .into_response(),

            ValidJsonError::ValidationMultiple(outer_err) => Error::new(outer_err.to_owned())
                .with_status(Some(StatusCode::BAD_REQUEST))
                .with_context(outer_err.0)
                .into_response(),
        }
    }
}

impl<T, S> FromRequest<S> for Valid<Json<T>>
where
    T: DeserializeOwned + Validate,
    S: Send + Sync,
{
    type Rejection = ValidJsonError;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let Json(value) = Json::<T>::from_request(req, state).await?;

        value.validate()?;

        Ok(Valid(Json(value)))
    }
}
