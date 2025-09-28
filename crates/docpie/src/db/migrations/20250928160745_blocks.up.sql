-- Add up migration script here
CREATE TABLE blocks (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES blocks(id)
);