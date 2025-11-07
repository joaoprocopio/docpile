import { useRouter } from "#app"

export async function rerunMiddleware(router = useRouter()) {
    const route = router.currentRoute.value

    await router.push({
        name: route.name,
        hash: route.hash,
        params: route.params,
        query: route.query,
        force: true,
        replace: true,
    })
}
