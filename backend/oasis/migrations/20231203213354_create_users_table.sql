-- Add migration script here
-- Create Users table
CREATE TABLE users(
    id uuid NOT NULL,
    PRIMARY KEY (id),
    email TEXT NOT NULL UNIQUE,
    user_name TEXT NOT NULL,
    user_surname TEXT NOT NULL,
    created_at timestamptz NOT NULL
);