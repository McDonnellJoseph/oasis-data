#[tokio::test]
async fn spawn_app() {
    let server = oasislib::run("127.0.0.1:0").expect("Failed to bind address");
    let _ = tokio::spawn(server);
}
