import { users } from "#shared/auth/models"
import { OrgMembershipRole } from "#shared/org/schemas"
import { constEnumToValues } from "#shared/utils/const"
import { sqliteTable, text, integer, uniqueIndex, index } from "drizzle-orm/sqlite-core"

export const orgs = sqliteTable(
    "orgs",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        name: text("name", { length: 64 }).notNull(),
        slug: text("slug", { length: 256 }).notNull(),
        created_at: integer("created_at", { mode: "timestamp" })
            .notNull()
            .$default(() => new Date()),
        updated_at: integer("updated_at", { mode: "timestamp" })
            .notNull()
            .$default(() => new Date())
            .$onUpdate(() => new Date()),
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
        role: text("role", {
            enum: constEnumToValues(OrgMembershipRole),
        }).notNull(),
        invite_token: text("invite_token"),
        created_at: integer("created_at", { mode: "timestamp" })
            .notNull()
            .$default(() => new Date()),
        updated_at: integer("updated_at", { mode: "timestamp" })
            .notNull()
            .$default(() => new Date())
            .$onUpdate(() => new Date()),
    },
    (table) => [
        uniqueIndex("idx_org_membership_prevent_duplicate").on(table.user_id, table.org_id),
        uniqueIndex("idx_org_membership_invite_token").on(table.invite_token),
        index("idx_org_membership_user_id").on(table.user_id),
        index("idx_org_membership_org_id").on(table.org_id),
    ],
)

export type TOrgMembership = typeof orgMembership.$inferSelect
export type TOrgMembershipInsert = typeof orgMembership.$inferInsert
