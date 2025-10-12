import { useQueryClient } from "@tanstack/vue-query"

import { abortNavigation, defineNuxtRouteMiddleware, navigateTo } from "#app"
import { authQueries } from "~/lib/auth/query"
import { AuthRoutes, HomeRouteName, SignInRouteName } from "~/lib/router/constants"
import { isNil } from "~/utils/is"

// TODO: otimizar o middleware pra exibir um estado de loading melhor
// TODO: exibir um belo estado de erro para os diferentes casos
export default defineNuxtRouteMiddleware(async (to) => {
    const client = useQueryClient()

    try {
        const user = await client.ensureQueryData(authQueries.whoami())
        const isAuthenticated = !isNil(user)

        if (!isAuthenticated && !AuthRoutes.has(to.name as string)) {
            return navigateTo({ name: SignInRouteName })
        }

        if (isAuthenticated && AuthRoutes.has(to.name as string)) {
            return navigateTo({ name: HomeRouteName })
        }
    } catch {
        return abortNavigation()
    }
})
