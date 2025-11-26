-- Add down migration script here
DROP INDEX idx_org_membership_org_id;
DROP INDEX idx_org_membership_user_id;
DROP INDEX idx_org_membership_invite_token;
DROP INDEX idx_org_membership_prevent_duplicate;
DROP TABLE org_membership;
DROP TYPE org_membership_role;
DROP TABLE orgs;
DROP TYPE org_status;