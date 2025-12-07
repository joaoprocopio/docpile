import { sql } from "drizzle-orm"
import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"

// =============================================================================
// Users Table
// =============================================================================

export const users = sqliteTable(
    "users",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        email: text("email", { length: 320 }).notNull(),
        password: text("password").notNull(),
        display_name: text("display_name", { length: 256 }).notNull(),
        is_onboarded: integer("is_onboarded", { mode: "boolean" }).notNull().default(false),
        created_at: text("created_at")
            .notNull()
            .default(sql`(datetime('now'))`),
    },
    (table) => [uniqueIndex("idx_users_email").on(table.email)],
)

export type TUser = typeof users.$inferSelect
export type TNewUser = typeof users.$inferInsert

// =============================================================================
// Organizations Table
// =============================================================================

export const orgs = sqliteTable(
    "orgs",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        name: text("name", { length: 64 }).notNull(),
        slug: text("slug", { length: 256 }).notNull(),
        status: text("status", { enum: ["active"] })
            .notNull()
            .default("active"),
        created_at: text("created_at")
            .notNull()
            .default(sql`(datetime('now'))`),
    },
    (table) => [uniqueIndex("idx_orgs_slug").on(table.slug)],
)

export type TOrg = typeof orgs.$inferSelect
export type TNewOrg = typeof orgs.$inferInsert

// =============================================================================
// Organization Membership Table
// =============================================================================

export const orgMembership = sqliteTable(
    "org_membership",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        user_id: integer("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        org_id: integer("org_id")
            .notNull()
            .references(() => orgs.id, { onDelete: "cascade" }),
        role: text("role", { enum: ["owner", "member"] }).notNull(),
        invite_token: text("invite_token"),
        created_at: text("created_at")
            .notNull()
            .default(sql`(datetime('now'))`),
    },
    (table) => [
        uniqueIndex("idx_org_membership_prevent_duplicate").on(table.user_id, table.org_id),
        uniqueIndex("idx_org_membership_invite_token").on(table.invite_token),
    ],
)

export type TOrgMembership = typeof orgMembership.$inferSelect
export type TNewOrgMembership = typeof orgMembership.$inferInsert
