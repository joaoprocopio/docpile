import { defineNuxtModule } from "@nuxt/kit"

export default defineNuxtModule((_opts, nuxt) => {
    nuxt.options.css ??= []
    nuxt.options.css.push("vue-sonner/style.css")
})
