import { useQueryClient } from "@tanstack/vue-query"

import { abortNavigation, defineNuxtRouteMiddleware, navigateTo } from "#app"
import { HomeRouteName, SignInRouteName, UnauthenticatedRoutes } from "~/lib/router/constants"
import { authQueries } from "~/state/auth/query"
import { isNil } from "~/utils/is"

// TODO: otimizar o middleware pra exibir um estado de loading melhor
// TODO: exibir um belo estado de erro para os diferentes casos
export default defineNuxtRouteMiddleware(async (to) => {
    const client = useQueryClient()

    try {
        const user = await client.ensureQueryData(authQueries.whoami())
        const isAuthenticated = !isNil(user)

        if (!isAuthenticated && !UnauthenticatedRoutes.has(to.name as string)) {
            return navigateTo({ name: SignInRouteName })
        }

        if (isAuthenticated && UnauthenticatedRoutes.has(to.name as string)) {
            return navigateTo({ name: HomeRouteName })
        }
    } catch {
        return abortNavigation()
    }
})
