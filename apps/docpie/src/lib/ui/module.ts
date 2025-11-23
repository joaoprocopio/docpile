import { defineNuxtModule } from "@nuxt/kit"

export default defineNuxtModule((_, nuxt) => {
    nuxt.options.css ??= []
    nuxt.options.css.push("vue-sonner/style.css")
})
