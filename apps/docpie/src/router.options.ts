import type { RouterConfig } from "@nuxt/schema"
import type { RouteRecordRaw } from "vue-router"

import { AuthRoutes, OrgRoutes, OrgSlugParam } from "~/lib/router/constants"

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
        name: OrgRoutes.Home,
        path: `/org/:${OrgSlugParam}`,
        meta: {
            layout: "app",
        },
        component: () => import("~/pages/home"),
    },
    {
        name: OrgRoutes.Onboarding.Intro,
        path: `/org/:${OrgSlugParam}/onboarding`,
        meta: {
            layout: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-intro"),
    },
    {
        name: OrgRoutes.Onboarding.Theme,
        path: `/org/:${OrgSlugParam}/onboarding/theme`,
        meta: {
            layout: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-theme"),
    },

    {
        name: OrgRoutes.Onboarding.Team,
        path: `/org/:${OrgSlugParam}/onboarding/team`,
        meta: {
            layout: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-team"),
    },
]

export default <RouterConfig>{
    routes: () => routes,
}
