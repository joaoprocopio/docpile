import { db } from "#server/db"
import { env } from "#shared/env"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { betterAuth } from "better-auth/minimal"

export const auth = betterAuth({
    secret: env.AUTH_SECRET,
    appName: env.APP_NAME,
    baseURL: env.BASE_URL,
    basePath: "/api/v1/auth",
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 7 * 24 * 60 * 60, // 7 days cache duration
            strategy: "jwe", // can be "jwt" or "compact"
            refreshCache: true, // Enable stateless refresh
        },
    },
    account: {
        storeStateStrategy: "cookie",
        storeAccountCookie: true,
    },
})
