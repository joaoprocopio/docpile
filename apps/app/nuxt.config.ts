// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "latest",
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image"
  ],
  srcDir: "src/",
  ssr: false,
  telemetry: false,
  pages: false,
  imports: { autoImport: false },
  devtools: { enabled: true },
})