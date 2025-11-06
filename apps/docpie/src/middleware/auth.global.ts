import { useQueryClient } from "@tanstack/vue-query"

import { abortNavigation, defineNuxtRouteMiddleware, navigateTo } from "#app"
import {
    AppRoutes,
    AuthRoutes,
    AuthRoutesSet,
    OnboardingRoutes,
    OnboardingRoutesSet,
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
    const isOnboarded = isAuthenticated && user.value!.is_onboarded

    /* This is a message for the future me.
     * You need to remeber that the order of the assertions matter.
     *
     * You need to:
     * - 1st: Redirect unauthorized users;
     * - 2nd: Redirect to onboarding users that need onboarding;
     * - 3rd: Now that you know that the user is authenticated and onboarded, redirect to home.
     */
    if (!isAuthenticated && !AuthRoutesSet.has(to.name as string)) {
        return navigateTo({ name: AuthRoutes.SignIn })
    }

    if (
        isAuthenticated &&
        !OnboardingRoutesSet.has(to.name as string) &&
        !user.value!.is_onboarded
    ) {
        return navigateTo({ name: OnboardingRoutes.Intro })
    }

    if (
        isAuthenticated &&
        (AuthRoutesSet.has(to.name as string) || OnboardingRoutesSet.has(to.name as string)) &&
        user.value!.is_onboarded
    ) {
        return navigateTo({ name: AppRoutes.Home })
    }
})
