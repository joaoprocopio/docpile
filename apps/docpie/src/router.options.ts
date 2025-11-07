import type { RouterConfig } from "@nuxt/schema"
import type { RouteRecordRaw } from "vue-router"

import { AuthRoutes, OrgRoutes, SlugParam } from "~/lib/router/constants"

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
        path: `/org/:${SlugParam}/onboarding`,
        meta: {
            layout: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-intro"),
    },
    {
        name: OrgRoutes.Onboarding.Theme,
        path: `/org/:${SlugParam}/onboarding/theme`,
        meta: {
            layout: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-theme"),
    },
    {
        name: OrgRoutes.Onboarding.Team,
        path: `/org/:${SlugParam}/onboarding/team`,
        meta: {
            layout: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-team"),
    },
    {
        name: OrgRoutes.Home,
        path: `/org/:${SlugParam}`,
        meta: {
            layout: "app",
        },
        component: () => import("~/pages/home"),
    },
]

export default <RouterConfig>{
    routes: () => routes,
}
