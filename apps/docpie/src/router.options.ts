import type { RouterConfig } from "@nuxt/schema"
import type { RouteRecordRaw } from "vue-router"

import { AppRoutes, AuthRoutes, OnboardingRoutes, OrgRoutes } from "~/lib/router/constants"

const routes = <Readonly<RouteRecordRaw[]>>[
    {
        name: AppRoutes.Home,
        path: "/",
        component: () => import("~/pages/home"),
    },
    {
        path: "/org",
        children: [
            {
                name: OrgRoutes.Create,
                path: "",
                component: () => import("~/pages/org-create"),
            },
            {
                path: ":slug",
                children: [
                    {
                        path: "onboarding",
                        component: () => import("~/pages/org-onboarding"),
                        meta: {
                            layout: false,
                        },
                        children: [
                            {
                                name: OrgRoutes.Onboarding.Intro,
                                path: "",
                                component: () => import("~/pages/org-onboarding-intro"),
                            },
                            {
                                name: OrgRoutes.Onboarding.Theme,
                                path: "theme",
                                component: () => import("~/pages/org-onboarding-theme"),
                            },

                            {
                                name: OrgRoutes.Onboarding.Team,
                                path: "team",
                                component: () => import("~/pages/org-onboarding-team"),
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: "/auth",
        children: [
            {
                name: AuthRoutes.SignIn,
                path: "signin",
                component: () => import("~/pages/signin"),
                meta: {
                    layout: "auth",
                },
            },
            {
                name: AuthRoutes.SignUp,
                path: "signup",
                component: () => import("~/pages/signup"),
                meta: {
                    layout: "auth",
                },
            },
        ],
    },
]

export default <RouterConfig>{
    routes: () => routes,
}
