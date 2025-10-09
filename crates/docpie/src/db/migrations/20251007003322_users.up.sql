-- Add up migration script here
CREATE TABLE users (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(320) NOT NULL,
    "password" TEXT NOT NULL,
    "display_name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
