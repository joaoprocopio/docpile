import type { RouterConfig } from "@nuxt/schema"
import type { RouteRecordRaw } from "vue-router"

import { HomeRouteName, LoginRouteName, SignupRouteName } from "~/constants/routes"

const routes = <Readonly<RouteRecordRaw[]>>[
    {
        name: HomeRouteName,
        path: "/",
        component: () => import("~/pages/home"),
    },
    {
        name: LoginRouteName,
        path: "/login",
        component: () => import("~/pages/login"),
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
