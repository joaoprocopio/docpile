export default defineNuxtConfig({
  extends: ['./src/auth'],
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@nuxt/image'],
  ssr: true,
  imports: { autoImport: false },
  devtools: { enabled: true },
  srcDir: 'src/',
  compatibilityDate: 'latest',
  telemetry: false,
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
