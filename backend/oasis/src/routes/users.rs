use actix_web::{HttpResponse, web};
use sqlx::PgPool;
use chrono::Utc;
use uuid::Uuid;

#[derive(serde::Deserialize)]
pub struct FormData {
    email: String,
    name: String,
    surname: String, 
}
pub async fn register(form: web::Form<FormData>, pool: web::Data<PgPool>) -> HttpResponse {
    sqlx::query!(
        r#"INSERT INTO users (id, email, user_name, user_surname, created_at)
        VALUES ($1, $2, $3, $4, $5)"#,
        Uuid::new_v4(), 
        form.email, 
        form.name, 
        form.surname,
        Utc::now()
    )
    .execute(pool.get_ref())
    .await;

    HttpResponse::Ok().finish()
}