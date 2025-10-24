import { useQueryClient } from "@tanstack/vue-query"

import { abortNavigation, defineNuxtRouteMiddleware, navigateTo } from "#app"
import {
    HomeRouteName,
    OnboardingIntroRouteName,
    OnboardingRoutes,
    SignInRoute,
    UnauthorizedRoutes,
} from "~/lib/router/constants"
import { authQueries } from "~/state/auth/query"
import { isNil } from "~/utils/is"

// TODO: otimizar o middleware pra exibir um estado de loading melhor
// TODO: exibir um belo estado de erro para os diferentes casos
export default defineNuxtRouteMiddleware(async (to) => {
    const client = useQueryClient()

    const [user] = await Promise.allSettled([client.ensureQueryData(authQueries.whoami())])

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
     * - 3rd: Now that you know that the user is authenticated and onboarded, redirect to home.
     */
    if (!isAuthenticated && !UnauthorizedRoutes.has(to.name as string)) {
        return navigateTo({ name: SignInRoute })
    }

    if (isAuthenticated && !OnboardingRoutes.has(to.name as string) && !user.value!.is_onboarded) {
        return navigateTo({ name: OnboardingIntroRouteName })
    }

    if (
        isAuthenticated &&
        (UnauthorizedRoutes.has(to.name as string) || OnboardingRoutes.has(to.name as string)) &&
        user.value!.is_onboarded
    ) {
        return navigateTo({ name: HomeRouteName })
    }
})
