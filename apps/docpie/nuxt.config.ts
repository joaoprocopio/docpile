export default defineNuxtConfig({
    modules: [
        "@nuxt/test-utils/module",
        "@nuxt/eslint",
        "@nuxt/fonts",
        "@nuxt/icon",
        "@nuxt/image",
        "@nuxtjs/color-mode",
        "~/lib/devproxy/module.ts",
        "~/lib/tailwind/module.ts",
        "~/lib/query/module.ts",
        "~/lib/ui/module.ts",
    ],
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
    colorMode: {
        classSuffix: "",
        storage: "cookie",
    },
    runtimeConfig: {
        public: {
            apiUrl: "http://localhost:8000/api",
        },
    },
    srcDir: "src/",
    compatibilityDate: "latest",
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
