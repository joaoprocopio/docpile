import type { RouterConfig } from "@nuxt/schema"

import { homeRouteName } from "~/pages/home"

export default <RouterConfig>{
    routes: () => [
        {
            name: homeRouteName,
            path: "/",
            component: () => import("~/pages/home"),
        },
    ],
}
