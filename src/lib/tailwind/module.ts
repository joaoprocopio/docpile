import tailwindcss from "@tailwindcss/vite"
import { createResolver, defineNuxtModule } from "nuxt/kit"

export default defineNuxtModule((_, nuxt) => {
    const resolver = createResolver(import.meta.url)

    nuxt.options.vite.plugins ??= []
    nuxt.options.vite.plugins.push(tailwindcss())

    nuxt.options.css ??= []
    nuxt.options.css.push(resolver.resolve("./tailwind.css"))
})
