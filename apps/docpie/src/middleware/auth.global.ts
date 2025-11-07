import { useQueryClient } from "@tanstack/vue-query"

import { abortNavigation, defineNuxtRouteMiddleware, navigateTo } from "#app"
import { isClientErrorStatus } from "~/lib/http/status"
import { AuthRoutes, AuthRoutesSet, OrgRoutes } from "~/lib/router/constants"
import { authQueries } from "~/state/auth/query"
import { IsOnboarded } from "~/state/auth/schemas"
import { orgQueries } from "~/state/org/query"
import { isEmpty, isNetworkError, isNil } from "~/utils/is"

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

    if (
        orgs.status === "rejected" &&
        isNetworkError(orgs.reason) &&
        !isClientErrorStatus(orgs.reason.status!)
    ) {
        return abortNavigation(orgs.reason)
    }

    const isAuthenticated = !isNil(user.value)
    const isOnboarded = isAuthenticated && user.value!.is_onboarded
    const hasOrgMembership = orgs.status === "fulfilled" && !isEmpty(orgs.value)

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

    if (isAuthenticated && !hasOrgMembership && to.name !== OrgRoutes.Create) {
        return navigateTo({ name: OrgRoutes.Create })
    }

    if (isAuthenticated && !isOnboarded) {
    }
})
