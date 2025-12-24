import { defineConfig } from "drizzle-kit"

// import { loadNuxtConfig } from "nuxt/kit"

// export default loadNuxtConfig({ cwd: process.cwd() }).then((cfg) =>
//     defineConfig({
//         schema: "./server/db/schema.ts",
//         out: "./server/db/migrations",
//         dialect: "sqlite",
//         dbCredentials: {
//             url: cfg.runtimeConfig.dbDsn as string,
//         },
//     }),
// )

console.log()
export default defineConfig({
    schema: "./server/**/models.ts",
    out: "./server/db/migrations",
    dialect: "sqlite",
    dbCredentials: {
        url: "docpie.db",
    },
    verbose: true,
})
