import type { RouterConfig } from "@nuxt/schema"
import type { RouteRecordRaw } from "vue-router"

import { AuthRoutes, OrgRoutes } from "~/lib/router/constants"

const routes = <Readonly<RouteRecordRaw[]>>[
    {
        name: AuthRoutes.SignIn,
        path: "/auth/signin",
        meta: {
            layout: "auth",
        },
        component: () => import("~/pages/signin"),
    },
    {
        name: AuthRoutes.SignUp,
        path: "/auth/signup",
        meta: {
            layout: "auth",
        },
        component: () => import("~/pages/signup"),
    },
    {
        name: OrgRoutes.Create,
        path: "/org",
        meta: {
            layout: "onboarding",
        },
        component: () => import("~/pages/org-create"),
    },
    {
        name: OrgRoutes.Onboarding.Intro,
        path: "/org/:slug/onboarding",
        meta: {
            layout: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-intro"),
    },
    {
        name: OrgRoutes.Onboarding.Theme,
        path: "/org/:slug/onboarding/theme",
        meta: {
            layout: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-theme"),
    },
    {
        name: OrgRoutes.Onboarding.Team,
        path: "/org/:slug/onboarding/team",
        meta: {
            layout: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-team"),
    },
    {
        name: OrgRoutes.Home,
        path: "/org/:slug",
        meta: {
            layout: "app",
        },
        component: () => import("~/pages/home"),
    },
]

export default <RouterConfig>{
    routes: () => routes,
}
