/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { useRouter } from "#app"
import type { NavigationFailure } from "vue-router"

export async function rerunMiddleware(
    router = useRouter(),
    route = router.currentRoute.value,
): Promise<NavigationFailure | void | undefined> {
    return await router.push({
        name: route.name,
        hash: route.hash,
        params: route.params,
        query: route.query,
        force: true,
        replace: true,
    })
}
