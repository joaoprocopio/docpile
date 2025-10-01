-- Add up migration script here
CREATE TABLE org (
    "id" INT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT org_id_check CHECK ("id" > 0),
    CONSTRAINT org_status_check CHECK("status" in ('active'))
);