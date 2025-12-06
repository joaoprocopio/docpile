// @ts-check

import type { RouterConfig } from "@nuxt/schema"
import type { RouteRecordRaw } from "vue-router"

import { AuthRoutes, OrgOnboardingRoutes, OrgRoutes } from "~/lib/router/constants"
import { dyn, path } from "~/lib/router/path"

const routes = <Readonly<RouteRecordRaw[]>>[
    {
        name: AuthRoutes.SignIn.value,
        path: path("auth", "signin"),
        meta: {
            layout: "auth",
        },
        component: () => import("~/pages/auth-signin"),
    },
    {
        name: AuthRoutes.SignUp.value,
        path: path("auth", "signup"),
        meta: {
            layout: "auth",
        },
        component: () => import("~/pages/auth-signup"),
    },
    {
        name: OrgRoutes.Join.value,
        path: path(
            "org",
            dyn(OrgRoutes.Join.params.slug),
            "join",
            dyn(OrgRoutes.Join.params.token),
        ),
        meta: {
            layout: false,
            middleware: "join",
        },
        component: () => import("~/pages/org-join"),
    },
    {
        name: OrgRoutes.Create.value,
        path: path("org"),
        meta: {
            layout: "onboarding",
        },
        component: () => import("~/pages/org-create"),
    },
    {
        name: OrgOnboardingRoutes.Intro.value,
        path: path("org", dyn(OrgOnboardingRoutes.Intro.params.slug), "onboarding"),
        meta: {
            layout: "onboarding",
            middleware: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-intro"),
    },
    {
        name: OrgOnboardingRoutes.Theme.value,
        path: path("org", dyn(OrgOnboardingRoutes.Theme.params.slug), "onboarding", "theme"),
        meta: {
            layout: "onboarding",
            middleware: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-theme"),
    },
    {
        name: OrgOnboardingRoutes.Invite.value,
        path: path("org", dyn(OrgOnboardingRoutes.Invite.params.slug), "onboarding", "invite"),
        meta: {
            layout: "onboarding",
            middleware: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-invite"),
    },
    {
        name: OrgRoutes.Home.value,
        path: path("org", dyn(OrgRoutes.Home.params.slug)),
        meta: {
            layout: "org",
        },
        component: () => import("~/pages/org-home"),
    },
]

export default <RouterConfig>{
    routes: () => routes,
}
