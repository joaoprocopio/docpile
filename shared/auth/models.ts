import { sql } from "drizzle-orm"
import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"

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
export type TUserInsert = typeof users.$inferInsert
