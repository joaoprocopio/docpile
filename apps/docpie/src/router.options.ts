import type { RouterConfig } from "@nuxt/schema"
import type { RouteRecordRaw } from "vue-router"

import {
    HomeRouteName,
    OnboardingOrgRouteName,
    OnboardingRouteName,
    SignInRouteName,
    SignUpRouteName,
} from "~/lib/router/constants"

const routes = <Readonly<RouteRecordRaw[]>>[
    {
        name: HomeRouteName,
        path: "/",
        component: () => import("~/pages/home"),
    },
    {
        name: OnboardingRouteName,
        path: "/onboarding",
        component: () => import("~/pages/onboarding"),
        meta: {
            layout: false,
            middleware: "onboarding",
        },
        children: [
            {
                name: OnboardingOrgRouteName,
                path: "/org",
                component: () => import("~/pages/onboarding-org"),
            },
        ],
    },
    {
        name: SignInRouteName,
        path: "/signin",
        component: () => import("~/pages/signin"),
        meta: {
            layout: "auth",
        },
    },
    {
        name: SignUpRouteName,
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
