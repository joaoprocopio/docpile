export default defineNuxtConfig({
  compatibilityDate: "2024-11-21",
  future: {
    compatibilityVersion: 4,
  },
  devtools: {
    enabled: true,
  },
  srcDir: "src",
  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon", "@nuxtjs/color-mode", "@vueuse/nuxt"],
  app: {
    head: {
      title: "Docpile",
      htmlAttrs: {
        lang: "en",
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
