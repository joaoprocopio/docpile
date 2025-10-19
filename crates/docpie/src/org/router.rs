use crate::{
    auth::{self, sessions::AuthSession},
    error::{Error, ErrorKind, Result, anyerror},
    ext::validator::Valid,
    http::config::Server,
    org::{
        schemas::{CreateOrg, ReadOrg},
        services::{create_org, list_membered_orgs},
    },
};
use axum::{Json, extract::State, routing};
use axum::{Router, http::StatusCode};

pub fn router_v1() -> Router<Server> {
    Router::new().route(
        "/",
        routing::get(list_orgs_v1)
            .post(create_org_v1)
            .layer(auth::protected!()),
    )
}

async fn list_orgs_v1(
    session: AuthSession,
    State(server): State<Server>,
) -> Result<Json<Vec<ReadOrg>>, Error> {
    let user = session.user.expect("This route should be protected");
    let orgs = list_membered_orgs(&server, user).await.map_err(|e| {
        Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, e)
    })?;

    Ok(Json(orgs.into_iter().map(|u| u.into()).collect()))
}

async fn create_org_v1(
    session: AuthSession,
    State(server): State<Server>,
    Valid(Json(org_to_create)): Valid<Json<CreateOrg>>,
) -> Result<Json<ReadOrg>, Error> {
    let user = session.user.expect("This route should be protected");
    let org = create_org(&server, org_to_create, user)
        .await
        .map_err(|err| {
            let is_unique_violation = err
                .downcast_ref::<sqlx::Error>()
                .and_then(|err| err.as_database_error())
                .and_then(|err| Some(err.is_unique_violation()))
                .unwrap_or(false);

            if is_unique_violation {
                return Error::from_status(StatusCode::CONFLICT, ErrorKind::Database, err);
            }

            Error::from_status(StatusCode::INTERNAL_SERVER_ERROR, ErrorKind::Database, err)
        })?;

    Ok(Json(org.into()))
}
