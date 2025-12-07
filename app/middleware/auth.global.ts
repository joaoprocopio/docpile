import { abortNavigation, defineNuxtRouteMiddleware, navigateTo } from "#app"
import { isClientErrorStatus } from "#shared/utils/http-status"
import { isEmpty, isNil, isPlainObject, isString } from "#shared/utils/is"
import { useQueryClient } from "~/lib/cache"
import { isNetworkError } from "~/lib/http/utils"
import {
    AuthRoutes,
    AuthRoutesSet,
    OrgOnboardingRoutes,
    OrgOnboardingRoutesSet,
    OrgRoutes,
    OrgRoutesSet,
} from "~/lib/router/constants"
import { authCache } from "~/state/auth/cache"
import { orgCache } from "~/state/org/cache"

// TODO: otimizar o middleware pra exibir um estado de loading melhor
// TODO: exibir um belo estado de erro para os diferentes casos
export default defineNuxtRouteMiddleware(async (to) => {
    const client = useQueryClient()

    if (to.name === OrgRoutes.Join.value) {
        // Just let Invite route middleware do its job
        return undefined
    }

    const [user, orgs] = await Promise.allSettled([
        client.ensureQueryData(authCache.queries.whoami()),
        client.ensureQueryData(orgCache.queries.list()),
    ])

    if (
        user.status === "rejected" &&
        isNetworkError(user.reason) &&
        !isClientErrorStatus(user.reason.status!)
    ) {
        return abortNavigation(user.reason)
    }

    if (
        orgs.status === "rejected" &&
        isNetworkError(orgs.reason) &&
        !isClientErrorStatus(orgs.reason.status!)
    ) {
        return abortNavigation(orgs.reason)
    }

    const isAuthenticated = user.status === "fulfilled"
    const isOnboarded = isAuthenticated && user.value.is_onboarded
    const hasOrgMembership = orgs.status === "fulfilled" && !isEmpty(orgs.value)
    const { slug: toSlug } = to.params

    /* This is a message for the future me.
     * You need to remeber that the order of the assertions matter.
     *
     * You need to:
     * - 1st: Redirect unauthorized users;
     * - 2nd: Redirect to onboarding users that need onboarding;
     * - 3rd: Now that you know that the user is authenticated and onboarded, redirect to home.
     */
    if (!isAuthenticated && !AuthRoutesSet.has(to.name as string)) {
        return navigateTo({ name: AuthRoutes.SignIn.value })
    }

    if (isAuthenticated && !hasOrgMembership && to.name !== OrgRoutes.Create.value) {
        return navigateTo({ name: OrgRoutes.Create.value })
    }

    if (
        isAuthenticated &&
        hasOrgMembership &&
        OrgOnboardingRoutesSet.has(to.name as string) &&
        !isString(toSlug)
    ) {
        return abortNavigation("Slug param should be provided")
    }

    if (
        isAuthenticated &&
        hasOrgMembership &&
        OrgOnboardingRoutesSet.has(to.name as string) &&
        !isEmpty(orgs.value) &&
        orgs.value.findIndex((org) => org.slug === toSlug) === -1
    ) {
        const org = orgs.value[0]!

        return navigateTo({
            name: OrgOnboardingRoutes.Intro.value,
            params: {
                [OrgOnboardingRoutes.Intro.params.slug]: org.slug,
            },
        })
    }

    if (
        isAuthenticated &&
        hasOrgMembership &&
        !isOnboarded &&
        !OrgOnboardingRoutesSet.has(to.name as string)
    ) {
        const org = orgs.value[0]!

        return navigateTo({
            name: OrgOnboardingRoutes.Intro.value,
            params: {
                [OrgOnboardingRoutes.Intro.params.slug]: org.slug,
            },
        })
    }

    if (
        isAuthenticated &&
        hasOrgMembership &&
        isOnboarded &&
        OrgOnboardingRoutesSet.has(to.name as string)
    ) {
        const org = orgs.value[0]!

        return navigateTo({
            name: OrgRoutes.Home.value,
            params: {
                [OrgRoutes.Home.params.slug]: org.slug,
            },
        })
    }

    if (
        isAuthenticated &&
        hasOrgMembership &&
        isOnboarded &&
        !OrgRoutesSet.has(to.name as string)
    ) {
        const org = orgs.value[0]!

        return navigateTo({
            name: OrgRoutes.Home.value,
            params: {
                [OrgRoutes.Home.params.slug]: org.slug,
            },
        })
    }
})
