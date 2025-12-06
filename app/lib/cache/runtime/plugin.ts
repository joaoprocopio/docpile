import { defineNuxtPlugin } from "#app"
import type { QueryClientConfig, VueQueryPluginOptions } from "~/lib/cache"
import { QueryClient, VueQueryPlugin } from "~/lib/cache"

const queryClientConfig: QueryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 5000,
            throwOnError(error) {
                console.error(error)
                return false
            },
        },
        mutations: {
            throwOnError(error) {
                console.error(error)
                return false
            },
        },
    },
}

export default defineNuxtPlugin((nuxt) => {
    const queryClient: QueryClient = new QueryClient(queryClientConfig)
    const options: VueQueryPluginOptions = { queryClient }

    nuxt.vueApp.use(VueQueryPlugin, options)
})
