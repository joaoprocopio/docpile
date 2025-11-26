import { useQueryClient } from "@tanstack/vue-query"

import { abortNavigation, defineNuxtRouteMiddleware } from "#app"
import { orgCache } from "~/state/org/cache"
import { isString } from "~/utils/is"

// TODO: otimizar o middleware pra exibir um estado de loading melhor
// TODO: exibir um belo estado de erro para os diferentes casos
export default defineNuxtRouteMiddleware((to) => {
    const slug = to.params.slug

    if (!isString(slug)) {
        return abortNavigation("Slug param should be provided")
    }

    const client = useQueryClient()

    client.prefetchQuery(orgCache.queries.inviteToken({ orgSlug: slug }))
})
