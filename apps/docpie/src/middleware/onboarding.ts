import { useQueryClient } from "@tanstack/vue-query"

import { abortNavigation, defineNuxtRouteMiddleware, navigateTo } from "#app"
import { OnboardingOrgRouteName } from "~/lib/router/constants"
import { orgQueries } from "~/state/org/query"
import { isEmpty } from "~/utils/is"

export default defineNuxtRouteMiddleware(async (to) => {
    const client = useQueryClient()

    const [orgs] = await Promise.allSettled([client.ensureQueryData(orgQueries.orgs())])

    if (orgs.status === "rejected") {
        return abortNavigation(orgs.reason)
    }

    if (isEmpty(orgs.value) && to.name !== OnboardingOrgRouteName) {
        return navigateTo({ name: OnboardingOrgRouteName })
    }
})
