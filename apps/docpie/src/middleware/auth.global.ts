import { useQueryClient } from "@tanstack/vue-query"

import { defineNuxtRouteMiddleware } from "#app"
import { authQueries } from "~/lib/auth/query"
import { SignInRouteName, SignUpRouteName } from "~/lib/router/constants"

const _AuthRoutes = new Set([SignInRouteName, SignUpRouteName])

export default defineNuxtRouteMiddleware(async (_to, _from) => {
    const client = useQueryClient()
    const user = await client.ensureQueryData(authQueries.whoami())

    console.log(user)
})
