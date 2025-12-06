export default defineNuxtConfig({
    modules: [
        "@nuxt/test-utils/module",
        "@nuxt/eslint",
        "@nuxt/fonts",
        "@nuxt/icon",
        "@nuxt/image",
        "@nuxtjs/color-mode",
        "~/lib/error-handling/module.ts",
        "~/lib/tailwind/module.ts",
        "~/lib/cache/module.ts",
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
            apiUrl: "http://localhost:3000/api",
        },
    },
    compatibilityDate: "latest",
    typescript: {
        tsConfig: {
            compilerOptions: {
                lib: ["ES2022"],
            },
        },
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
