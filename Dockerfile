FROM rust:latest

WORKDIR /app
RUN apt update && apt install lld clang -y 

COPY ./backend/oasis/ .
ENV SQLX_OFFLINE true

RUN cargo build --release

ENTRYPOINT [ "./target/release/oasis" ]
