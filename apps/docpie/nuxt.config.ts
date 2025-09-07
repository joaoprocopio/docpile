import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  extends: ["./src/editor"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/color-mode",
    "reka-ui/nuxt",
  ],
  ssr: false,
  imports: { autoImport: false },
  devtools: { enabled: true },
  css: ["~/shared/assets/tailwind.css"],
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
