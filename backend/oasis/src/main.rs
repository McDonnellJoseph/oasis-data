use actix_web::{get, web::ServiceConfig, HttpResponse, Responder};
use shuttle_actix_web::ShuttleActixWeb;

#[get("/health_check")]
async fn health_check() -> impl Responder {
    HttpResponse::Ok()
}
#[shuttle_runtime::main]
async fn main() -> ShuttleActixWeb<impl FnOnce(&mut ServiceConfig) + Send + Clone + 'static> {
    let config = move |cfg: &mut ServiceConfig| {
        // set up your service here, e.g.:
        cfg.service(health_check);
    };

    Ok(config.into())
}
