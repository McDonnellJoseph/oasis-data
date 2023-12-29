use oasis::configuration::get_configuration;
use oasis::startup::run;
use oasis::telemetry::{get_subscriber, init_subscriber};
use sqlx::postgres::PgPoolOptions;
use std::net::TcpListener;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let subscriber = get_subscriber("oasis".into(), "info".into(), std::io::stdout);
    init_subscriber(subscriber);
    let configuration = get_configuration().expect("Failed to read configuration!");
    let connection_pool = PgPoolOptions::new()
        .max_lifetime(std::time::Duration::from_secs(2))
        .connect_lazy_with(configuration.database.with_db());
    sqlx::migrate!("./migrations/")
        .run(&connection_pool)
        .await
        .expect("Faield to migrate the database!");
    let address = format!(
        "{}:{}",
        configuration.application.host, configuration.application.port
    );
    let listener = TcpListener::bind(address)?;
    run(listener, connection_pool)?.await
}
