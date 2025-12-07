import { env } from "./shared/env"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    schema: "./server/db/schema.ts",
    out: "./server/db/migrations",
    dialect: "sqlite",
    dbCredentials: {
        url: env.DB_PATH,
    },
})
