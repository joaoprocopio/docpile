import { env } from "#shared/env"
import { defineAsyncComponent } from "vue"

export const CacheDevtools = env.IS_DEV
    ? defineAsyncComponent(async () => await import("./devtools.vue"))
    : undefined
