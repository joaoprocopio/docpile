export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: {
    enabled: true,
  },
  srcDir: "src",
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
  ],
  app: {
    head: {
      title: "Construa conosco seu catálogo virtual que vai impulsionar suas vendas",
      titleTemplate: "%s | Docpile",
      htmlAttrs: {
        lang: "pt-br",
      },
      meta: [
        {
          charset: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
    },
  },
  colorMode: {
    classSuffix: "",
  },
})
