-- Add down migration script here
DROP INDEX idx_users_email;
DROP TABLE users;