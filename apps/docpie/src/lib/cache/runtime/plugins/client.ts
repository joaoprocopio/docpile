import type { VueQueryPluginOptions } from "@tanstack/vue-query"
import { VueQueryPlugin } from "@tanstack/vue-query"

import { defineNuxtPlugin } from "#app"

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
