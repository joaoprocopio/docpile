-- Add up migration script here
CREATE TABLE org (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(256),
    "status" VARCHAR(64),
    CONSTRAINT org_status_check CHECK("status" in ('active'))
);