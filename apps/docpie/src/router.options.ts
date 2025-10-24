import type { RouterConfig } from "@nuxt/schema"
import type { RouteRecordRaw } from "vue-router"

import { AppRoutes, AuthRoutes, OnboardingRoutes } from "~/lib/router/constants"

const routes = <Readonly<RouteRecordRaw[]>>[
    {
        name: AppRoutes.Home,
        path: "/",
        component: () => import("~/pages/home"),
    },
    {
        path: "/onboarding",
        component: () => import("~/pages/onboarding"),
        meta: {
            layout: false,
            middleware: "onboarding",
        },
        children: [
            {
                name: OnboardingRoutes.Intro,
                path: "",
                component: () => import("~/pages/onboarding-intro"),
            },
            {
                name: OnboardingRoutes.Theme,
                path: "theme",
                component: () => import("~/pages/onboarding-theme"),
            },
            {
                name: OnboardingRoutes.Org,
                path: "org",
                component: () => import("~/pages/onboarding-org"),
            },
            {
                name: OnboardingRoutes.Team,
                path: "team",
                component: () => import("~/pages/onboarding-team"),
            },
        ],
    },
    {
        name: AuthRoutes.SignIn,
        path: "/signin",
        component: () => import("~/pages/signin"),
        meta: {
            layout: "auth",
        },
    },
    {
        name: AuthRoutes.SignUp,
        path: "/signup",
        component: () => import("~/pages/signup"),
        meta: {
            layout: "auth",
        },
    },
]

export default <RouterConfig>{
    routes: () => routes,
}
