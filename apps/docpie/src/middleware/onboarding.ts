import { useQueryClient } from "@tanstack/vue-query"

import { defineNuxtRouteMiddleware } from "#app"
import { invariant } from "~/lib/invariant"
import { orgCache } from "~/state/org/cache"
import { isString } from "~/utils/is"

// TODO: otimizar o middleware pra exibir um estado de loading melhor
// TODO: exibir um belo estado de erro para os diferentes casos
export default defineNuxtRouteMiddleware((to) => {
    const { slug } = to.params

    invariant(isString(slug), "Slug param should be provided")

    const client = useQueryClient()
    client.prefetchQuery(orgCache.queries.inviteToken({ slug: slug }))
})
