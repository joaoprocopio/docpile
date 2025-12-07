import { sql } from "drizzle-orm"
import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"

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
export type TOrgInsert = typeof orgs.$inferInsert

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
export type TOrgMembershipInsert = typeof orgMembership.$inferInsert
