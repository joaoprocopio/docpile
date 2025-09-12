import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/color-mode",
    "reka-ui/nuxt",
  ],
  ssr: false,
  imports: {
    scan: false,
    autoImport: false,
    dirs: [],
  },
  devtools: {
    enabled: true,
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
  reka: {
    prefix: "internal",
  },
});
