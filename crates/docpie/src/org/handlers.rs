use crate::org::models::Org;
use crate::server::state::Server;
use axum::{Json, extract::State};

pub async fn list_orgs_v1(State(server): State<Server>) -> Json<Vec<Org>> {
    let orgs = sqlx::query_as!(
        Org,
        r#"
            SELECT *
            FROM org
        "#
    )
    .fetch_all(&server.db)
    .await
    .unwrap();

    Json(orgs)
}
