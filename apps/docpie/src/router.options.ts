import type { RouterConfig } from "@nuxt/schema"
import type { RouteRecordRaw } from "vue-router"

import { HomeRouteName, SigninRouteName, SignupRouteName } from "~/constants/routes"

const routes = <Readonly<RouteRecordRaw[]>>[
    {
        name: HomeRouteName,
        path: "/",
        component: () => import("~/pages/home"),
    },
    {
        name: SigninRouteName,
        path: "/signin",
        component: () => import("~/pages/signin"),
        meta: {
            layout: "auth",
        },
    },
    {
        name: SignupRouteName,
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
