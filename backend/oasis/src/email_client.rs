use crate::domain::UserEmail;
use reqwest::{Client, Url};
use secrecy::{ExposeSecret, Secret};

pub struct EmailClient {
    http_client: Client,
    base_url: Url,
    sender: UserEmail,
    authorization_token: Secret<String>,
}

impl EmailClient {
    pub fn new(base_url: Url, sender: UserEmail, authorization_token: Secret<String>) -> Self {
        Self {
            http_client: Client::new(),
            base_url,
            sender,
            authorization_token
        }
    }
    pub async fn send_email(
        &self,
        recipient: UserEmail,
        subject: &str,
        html_content: &str,
        text_content: &str,
    ) -> Result<(), reqwest::Error> {
        let url = self
            .base_url
            .join("email")
            .expect("Failed to join base_url and email");
        let request_body = SendEmailRequest {
            from: self.sender.as_ref(),
            to: recipient.as_ref(),
            subject: subject,
            html_body: html_content,
            text_body: text_content,
        };
        let _builder = self.http_client.post(url).header("X-Postmark-Server-Token", self.authorization_token.expose_secret()).json(&request_body).send().await?;

        Ok(())
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all="PascalCase")]
// Lifetime parameters always start with an apastrophe, `'`
struct SendEmailRequest<'a> {
    from: &'a str,
    to: &'a str,
    subject: &'a str,
    html_body: &'a str, 
    text_body: &'a str,
}

#[cfg(test)]
mod test {
    use crate::domain::UserEmail;
    use crate::email_client::EmailClient;
    use fake::faker::internet::en::SafeEmail;
    use fake::faker::lorem::en::{Paragraph, Sentence};
    use fake::{Fake, Faker};
    use reqwest::Url;
    use wiremock::matchers::{header_exists, header, path,  method};
    use wiremock::{Mock, MockServer, ResponseTemplate, Request};
    use secrecy::Secret;

    struct SendBodyEmailBodyMatcher; 

    impl wiremock::Match for SendBodyEmailBodyMatcher {
        fn matches(&self, request: &Request) -> bool {
            let result: Result<serde_json::Value, _> = 
                serde_json::from_slice(&request.body);
            if let Ok(body) = result {
                // Check that all the mandatory fields are populated
                // without inspecting the field values
                dbg!(&body);
                body.get("From").is_some()
                    && body.get("To").is_some()
                    && body.get("Subject").is_some()
                    && body.get("HtmlBody").is_some()
                    && body.get("TextBody").is_some()
            } else {
                // If parsing failed, do not match the request
                false
            }
        }
    }

    #[tokio::test]
    async fn sends_email_sends_the_expected_request() {
        let mock_server = MockServer::start().await;
        let sender = UserEmail::parse(SafeEmail().fake()).unwrap();
        let email_client = EmailClient::new(
            Url::parse(&mock_server.uri()).expect("Failed to parse"),
            sender,
            Secret::new(Faker.fake())
        );
        Mock::given(header_exists("X-Postmark-Server-Token"))
            .and(header("Content-Type", "application/json"))
            .and(path("/email"))
            .and(method("POST"))
            .and(SendBodyEmailBodyMatcher)
            .respond_with(ResponseTemplate::new(200))
            .expect(1)
            .mount(&mock_server)
            .await;
        let user_email = UserEmail::parse(SafeEmail().fake()).unwrap();
        let subject: String = Sentence(1..2).fake();
        let content: String = Paragraph(1..10).fake();
        let _ = email_client
            .send_email(user_email, &subject, &content, &content)
            .await;
    }
}
