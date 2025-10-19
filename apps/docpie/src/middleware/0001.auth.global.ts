import { useQueryClient } from "@tanstack/vue-query"

import { abortNavigation, defineNuxtRouteMiddleware, navigateTo } from "#app"
import {
    HomeRouteName,
    OnboardingRouteName,
    SignInRouteName,
    UnauthenticatedRoutes,
} from "~/lib/router/constants"
import { authQueries } from "~/state/auth/query"
import { orgQueries } from "~/state/org/query"
import { isEmpty, isNil } from "~/utils/is"

// TODO: otimizar o middleware pra exibir um estado de loading melhor
// TODO: exibir um belo estado de erro para os diferentes casos
export default defineNuxtRouteMiddleware(async (to) => {
    const client = useQueryClient()
    const [user, orgs] = await Promise.allSettled([
        client.ensureQueryData(authQueries.whoami()),
        client.ensureQueryData(orgQueries.orgs()),
    ])

    if (user.status === "rejected") {
        return abortNavigation(user.reason)
    }

    const isAuthenticated = !isNil(user.value)

    /* This is a message for the future me.
     * You need to remeber that the order of the assertions matter.
     *
     * You need to:
     * - 1st: Redirect unauthorized users;
     * - 2nd: Redirect to onboarding users that need onboarding;
     * - 3rd: Now that you know that the user is authenticated and is onboarded, redirect to home.
     */
    if (!isAuthenticated && !UnauthenticatedRoutes.has(to.name as string)) {
        return navigateTo({ name: SignInRouteName })
    }

    if (isAuthenticated && to.name !== OnboardingRouteName) {
        if (orgs.status === "rejected") {
            return abortNavigation(orgs.reason)
        }

        if (orgs.status === "fulfilled" && isEmpty(orgs.value)) {
            return navigateTo({ name: OnboardingRouteName })
        }
    }

    if (isAuthenticated && UnauthenticatedRoutes.has(to.name as string)) {
        return navigateTo({ name: HomeRouteName })
    }
})
