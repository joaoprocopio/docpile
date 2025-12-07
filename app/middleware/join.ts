import { defineNuxtRouteMiddleware } from "#app"
import { invariant } from "#shared/utils/invariant"
import { isEmpty, isString } from "#shared/utils/is"
import { useQueryClient } from "@tanstack/vue-query"
import { authCache } from "~/state/auth/cache"
import { orgCache } from "~/state/org/cache"

export default defineNuxtRouteMiddleware(async (to) => {
    const { slug, token } = to.params

    invariant(isString(slug) && !isEmpty(slug), "Slug must me a valid non-empty string")
    invariant(isString(token) && !isEmpty(token), "Token must be a valid non-empty string")

    const client = useQueryClient()
    client.prefetchQuery(authCache.queries.whoami())
    client.prefetchQuery(orgCache.queries.resolveInviteToken({ slug: slug, token: token }))

    // TODO: implementar esse fluxo
    throw new Error("NOT IMPLEMENTED YET")
})
