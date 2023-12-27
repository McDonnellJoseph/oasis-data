use actix_web::{web, HttpResponse};
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

#[derive(serde::Deserialize)]
pub struct FormData {
    email: String,
    name: String,
    surname: String,
}
#[tracing::instrument(name="Adding a new user", skip(form,pool),fields( subscriber_email=%form.email, subscriber_name=%form.name, subscriber_surname=%form.surname))]
pub async fn register(form: web::Form<FormData>, pool: web::Data<PgPool>) -> HttpResponse {
    match insert_user(&pool, &form).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[tracing::instrument(name = "Saving new user details in the database", skip(form, pool))]
pub async fn insert_user(pool: &PgPool, form: &FormData) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"INSERT INTO users (id, email, user_name, user_surname, created_at)
        VALUES ($1, $2, $3, $4, $5)"#,
        Uuid::new_v4(),
        form.email,
        form.name,
        form.surname,
        Utc::now()
    )
    .execute(pool)
    .await
    .map_err(|e| {
        tracing::error!("Failed to execute query: {:?}", e);
        e
    })?;
    Ok(())
}
