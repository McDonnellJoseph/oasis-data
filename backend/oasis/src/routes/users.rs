use crate::domain::{NewUser, UserEmail, UserName};
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

impl TryFrom<FormData> for NewUser {
    type Error = String;

    fn try_from(value: FormData) -> Result<Self, Self::Error> {
        let name = UserName::parse(value.name)?;
        let surname = UserName::parse(value.surname)?;
        let email = UserEmail::parse(value.email)?;
        Ok(Self {
            email,
            name,
            surname,
        })
    }
}
#[tracing::instrument(name="Adding a new user", skip(form,pool),fields( subscriber_email=%form.email, subscriber_name=%form.name, subscriber_surname=%form.surname))]
pub async fn register(form: web::Form<FormData>, pool: web::Data<PgPool>) -> HttpResponse {
    let new_user = match form.0.try_into() {
        Ok(form) => form,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };

    match insert_user(&pool, &new_user).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[tracing::instrument(name = "Saving new user details in the database", skip(new_user, pool))]

pub async fn insert_user(pool: &PgPool, new_user: &NewUser) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"INSERT INTO users (id, email, user_name, user_surname, created_at)
        VALUES ($1, $2, $3, $4, $5)"#,
        Uuid::new_v4(),
        new_user.email.as_ref(),
        new_user.name.as_ref(),
        new_user.surname.as_ref(),
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
