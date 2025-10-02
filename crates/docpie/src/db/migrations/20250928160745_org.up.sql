-- Add up migration script here
CREATE TYPE org_status AS ENUM('active');

CREATE TABLE org (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(64),
    "status" ORG_STATUS
);
