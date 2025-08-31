import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  extends: ["./src/editor"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "reka-ui/nuxt",
  ],
  ssr: true,
  imports: { autoImport: false },
  devtools: { enabled: true },
  css: ["~/shared/assets/tailwind.css"],
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
    components: true,
  },
});
