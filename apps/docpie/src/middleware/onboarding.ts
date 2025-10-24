import { useQueryClient } from "@tanstack/vue-query"

import { abortNavigation, defineNuxtRouteMiddleware, navigateTo } from "#app"
import { OnboardingIntroRouteName, OnboardingRoutes } from "~/lib/router/constants"
import { authQueries } from "~/state/auth/query"
import { isEmpty } from "~/utils/is"

export default defineNuxtRouteMiddleware(async (to) => {
    const client = useQueryClient()

    const [user] = await Promise.allSettled([client.ensureQueryData(authQueries.whoami())])

    if (user.status === "rejected") {
        return abortNavigation(user.reason)
    }

    if (!isEmpty(user.value) && !OnboardingRoutes.has(to.name as string)) {
        return navigateTo({ name: OnboardingIntroRouteName })
    }
})
