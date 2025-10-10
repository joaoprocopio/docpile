import { useQueryClient } from "@tanstack/vue-query"

import { defineNuxtRouteMiddleware } from "#app"
import { SignInRouteName, SignUpRouteName } from "~/constants/routes"
import { authQueries } from "~/query/auth"

const _AuthRoutes = new Set([SignInRouteName, SignUpRouteName])

export default defineNuxtRouteMiddleware(async (_to, _from) => {
    const client = useQueryClient()
    const user = await client.ensureQueryData(authQueries.whoami())

    console.log(user)
})
