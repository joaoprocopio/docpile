import { useQueryClient } from "@tanstack/vue-query"

import { defineNuxtRouteMiddleware, navigateTo } from "#imports"
import { SignInRouteName, SignUpRouteName } from "~/constants/routes"
import { authQueries } from "~/query/auth"
import type { TUserOut } from "~/schemas/auth"

const AuthRoutes = new Set([SignInRouteName, SignUpRouteName])

export default defineNuxtRouteMiddleware(async (to) => {
    const queryClient = useQueryClient()

    let user: TUserOut | undefined = undefined
    let error: Error | undefined = undefined

    try {
        user = await queryClient.fetchQuery(authQueries.me())
    } catch (e) {
        error = e as Error
    }

    if ((!user || error) && !AuthRoutes.has(to?.name as string)) {
        return navigateTo({ name: SignInRouteName })
    }
})
