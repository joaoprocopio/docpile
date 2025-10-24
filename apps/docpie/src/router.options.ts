import type { RouterConfig } from "@nuxt/schema"
import type { RouteRecordRaw } from "vue-router"

import {
    HomeRouteName,
    OnboardingIntroRouteName,
    OnboardingOrgRouteName,
    OnboardingTeamRouteName,
    OnboardingThemeRouteName,
    SignInRoute,
    SignUpRoute,
} from "~/lib/router/constants"

const routes = <Readonly<RouteRecordRaw[]>>[
    {
        name: HomeRouteName,
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
                name: OnboardingIntroRouteName,
                path: "",
                component: () => import("~/pages/onboarding-intro"),
            },
            {
                name: OnboardingThemeRouteName,
                path: "theme",
                component: () => import("~/pages/onboarding-theme"),
            },
            {
                name: OnboardingOrgRouteName,
                path: "org",
                component: () => import("~/pages/onboarding-org"),
            },
            {
                name: OnboardingTeamRouteName,
                path: "team",
                component: () => import("~/pages/onboarding-team"),
            },
        ],
    },
    {
        name: SignInRoute,
        path: "/signin",
        component: () => import("~/pages/signin"),
        meta: {
            layout: "auth",
        },
    },
    {
        name: SignUpRoute,
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
