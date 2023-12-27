# Builder Stage
FROM rust as builder
WORKDIR /app
RUN apt update && apt install lld clang -y 
COPY ./backend/oasis/ .
ENV SQLX_OFFLINE true
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update -y \
      && apt-get install -y --no-install-recommends --assume-yes openssl ca-certificates \
      && apt-get autoremove -y \
      && apt-get clean -y \
      && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/oasis oasis 
COPY ./backend/oasis/configuration configuration
ENV APP_ENVIRONMENT production
ENTRYPOINT [ "./oasis" ]
