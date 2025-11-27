import { useQueryClient } from "@tanstack/vue-query"

import { defineNuxtRouteMiddleware } from "#app"
import { invariant } from "~/lib/invariant"
import { authCache } from "~/state/auth/cache"
import { orgCache } from "~/state/org/cache"
import { isEmpty, isString } from "~/utils/is"

export default defineNuxtRouteMiddleware(async (to) => {
    const { slug, token } = to.params

    invariant(isString(slug) && !isEmpty(slug), "Slug must me a valid non-empty string")
    invariant(isString(token) && !isEmpty(token), "Token must be a valid non-empty string")

    const client = useQueryClient()
    client.prefetchQuery(authCache.queries.whoami())
    client.prefetchQuery(orgCache.queries.resolveInviteToken({ slug: slug, token: token }))
})
