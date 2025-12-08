import { env } from "#shared/env"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"

const sqlite = new Database(env.DB_DSN)

sqlite.pragma("journal_mode = WAL")

export const db = drizzle(sqlite)
