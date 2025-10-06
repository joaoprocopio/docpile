import { useQueryClient } from "@tanstack/vue-query"

import { defineNuxtRouteMiddleware } from "#imports"
import { authQueries } from "~/query/auth"

export default defineNuxtRouteMiddleware(async () => {
    const queryClient = useQueryClient()

    queryClient.prefetchQuery(authQueries.me())
})
