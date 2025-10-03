import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
    modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "@nuxtjs/color-mode"],
    plugins: ["~/lib/query/plugin.ts", "~/lib/form/plugin.ts"],
    ssr: false,
    pages: {
        enabled: true,
        pattern: [],
    },
    components: {
        dirs: [],
    },
    imports: {
        scan: false,
        autoImport: false,
        dirs: [],
    },
    devtools: {
        enabled: true,
    },
    app: {
        head: {
            title: "Docpie",
        },
    },
    css: ["~/assets/tailwind.css"],
    colorMode: {
        classSuffix: "",
        storage: "cookie",
    },
    srcDir: "src/",
    compatibilityDate: "latest",
    vite: {
        plugins: [tailwindcss()],
    },
    telemetry: false,
    eslint: {
        config: {
            nuxt: {
                sortConfigKeys: true,
            },
        },
    },
    fonts: {
        families: [
            {
                preload: true,
                name: "Inter",
                provider: "google",
                weights: [400, 500, 600, 700],
            },
        ],
    },
    icon: {
        mode: "svg",
    },
})
