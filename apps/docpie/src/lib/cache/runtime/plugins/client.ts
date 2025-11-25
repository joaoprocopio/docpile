import { defineNuxtPlugin } from "#app"
import type { VueQueryPluginOptions } from "~/lib/cache"
import { VueQueryPlugin } from "~/lib/cache"

export default defineNuxtPlugin((nuxt) => {
    const options: VueQueryPluginOptions = {
        queryClientConfig: {
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
        },
    }

    nuxt.vueApp.use(VueQueryPlugin, options)
})
