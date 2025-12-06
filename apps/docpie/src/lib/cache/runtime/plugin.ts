import { defineNuxtPlugin, useState } from "#app"
import { env } from "~/env"
import type { DehydratedState, QueryClientConfig, VueQueryPluginOptions } from "~/lib/cache"
import { dehydrate, hydrate, QueryClient, VueQueryPlugin } from "~/lib/cache"

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
    const vueQueryState = useState<DehydratedState | null>("vue-query")

    const queryClient: QueryClient = new QueryClient(queryClientConfig)
    const options: VueQueryPluginOptions = { queryClient }

    nuxt.vueApp.use(VueQueryPlugin, options)

    if (env.IS_SERVER) {
        nuxt.hooks.hook("app:rendered", () => {
            vueQueryState.value = dehydrate(queryClient)
        })
    }

    if (env.IS_CLIENT) {
        hydrate(queryClient, vueQueryState.value)
    }
})
