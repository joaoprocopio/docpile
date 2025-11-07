import { resolve } from "node:path"

import { defineVitestProject } from "@nuxt/test-utils/config"
import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        projects: [
            {
                resolve: {
                    alias: {
                        "~": resolve(__dirname, "./src"),
                    },
                },
                test: {
                    name: "unit",
                    include: ["tests/{e2e,unit}/*.{test,spec}.ts"],
                    environment: "node",
                },
            },
            await defineVitestProject({
                test: {
                    name: "nuxt",
                    include: ["tests/nuxt/*.{test,spec}.ts"],
                    environment: "nuxt",
                },
            }),
        ],
    },
})
