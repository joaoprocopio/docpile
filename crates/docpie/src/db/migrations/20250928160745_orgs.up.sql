-- Add up migration script here
CREATE TYPE org_status AS ENUM('active');

CREATE TABLE orgs (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(64) NOT NULL,
    "status" ORG_STATUS NOT NULL
);
