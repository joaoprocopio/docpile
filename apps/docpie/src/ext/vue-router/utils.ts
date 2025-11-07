import { reloadNuxtApp } from "#app"

export function rerunMiddleware() {
    reloadNuxtApp({
        force: true,
        ttl: 0,
    })
}
