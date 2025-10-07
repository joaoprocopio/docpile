use axum::{
    Json,
    extract::{FromRequest, Request, rejection::JsonRejection},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::de::DeserializeOwned;
use validator::Validate;

pub struct Valid<T>(pub T);

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
            ValidJsonError::Json(err) => err.into_response(),
            ValidJsonError::Validation(err) => {
                (StatusCode::BAD_REQUEST, format!("{}", err)).into_response()
            }
            ValidJsonError::ValidationMultiple(err) => {
                (StatusCode::BAD_REQUEST, format!("{}", err)).into_response()
            }
        }
    }
}
