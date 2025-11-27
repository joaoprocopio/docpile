import type { RouterConfig } from "@nuxt/schema"
import type { RouteRecordRaw } from "vue-router"

import { AuthRoutes, OrgRoutes } from "~/lib/router/constants"

const routes = <Readonly<RouteRecordRaw[]>>[
    {
        name: AuthRoutes.SignIn.value,
        path: "/auth/signin",
        meta: {
            layout: "auth",
        },
        component: () => import("~/pages/signin"),
    },
    {
        name: AuthRoutes.SignUp.value,
        path: "/auth/signup",
        meta: {
            layout: "auth",
        },
        component: () => import("~/pages/signup"),
    },
    {
        name: OrgRoutes.Join,
        path: "/org/:slug/join/:token",
        meta: {
            layout: false,
            middleware: "join",
        },
        component: () => import("~/pages/join"),
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
            middleware: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-intro"),
    },
    {
        name: OrgRoutes.Onboarding.Theme,
        path: "/org/:slug/onboarding/theme",
        meta: {
            layout: "onboarding",
            middleware: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-theme"),
    },
    {
        name: OrgRoutes.Onboarding.Invite,
        path: "/org/:slug/onboarding/invite",
        meta: {
            layout: "onboarding",
            middleware: "onboarding",
        },
        component: () => import("~/pages/org-onboarding-invite"),
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
