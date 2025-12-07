import { defineNuxtRouteMiddleware } from "#app"
import { invariant } from "#shared/utils/invariant"
import { isString } from "#shared/utils/is"
import { useQueryClient } from "@tanstack/vue-query"
import { authCache } from "~/state/auth/cache"
import { orgCache } from "~/state/org/cache"

// TODO: otimizar o middleware pra exibir um estado de loading melhor
// TODO: exibir um belo estado de erro para os diferentes casos
export default defineNuxtRouteMiddleware((to) => {
    const { slug } = to.params

    invariant(isString(slug), "Slug param should be provided")

    const client = useQueryClient()

    client.prefetchQuery(authCache.queries.whoami())
    client.prefetchQuery(orgCache.queries.inviteToken({ slug: slug }))
})
