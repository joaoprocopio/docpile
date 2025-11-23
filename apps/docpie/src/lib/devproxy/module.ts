import { defineNuxtModule } from "@nuxt/kit"

const HOST = "localhost"
const PORT = 5173

export default defineNuxtModule((_, nuxt) => {
    if (!import.meta.dev) return

    nuxt.options.devServer.host = HOST
    nuxt.options.devServer.port = PORT

    nuxt.options.vite.server ??= {}
    nuxt.options.vite.server.hmr = {
        host: HOST,
        port: PORT,
        clientPort: PORT,
        overlay: true,
    }
})
