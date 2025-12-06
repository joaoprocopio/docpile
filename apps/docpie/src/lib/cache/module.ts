import { addPlugin, createResolver, defineNuxtModule } from "@nuxt/kit"

export default defineNuxtModule(() => {
    const resolver = createResolver(import.meta.url)

    addPlugin(resolver.resolve("./runtime/plugin.ts"))
})
