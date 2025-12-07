import type { QueryClient } from "@tanstack/vue-query"
import { useQueryClient } from "@tanstack/vue-query"
import { defineCache, key, mutationOptions, queryOptions } from "~/lib/cache/utils"
import { rerunMiddleware } from "~/lib/router/utils"
import { AuthServices } from "~/state/auth/services"
import { orgCache } from "~/state/org/cache"

export const authCache = defineCache("auth")({
    keys: {
        queries: {
            all: () => key("auth"),
            whoami: () => key("auth", "whoami"),
        },
        mutations: {
            signin: () => key("auth", "signin"),
            signup: () => key("auth", "signup"),
            signout: () => key("auth", "signout"),
            onboard: () => key("auth", "onboard"),
            refresh: () => key("auth", "refresh"),
        },
    },
    queries: {
        whoami: () =>
            queryOptions({
                queryKey: authCache.keys.queries.whoami(),
                queryFn: AuthServices.whoami,
                // Will be valid as long as the user is logged in.
                staleTime: Infinity,
            }),
    },
    mutations: {
        signin: (client: QueryClient = useQueryClient()) =>
            mutationOptions({
                mutationKey: authCache.keys.mutations.signin(),
                mutationFn: AuthServices.signin,
                onSuccess(data) {
                    client.setQueryData(authCache.keys.queries.whoami(), data)
                    client.prefetchQuery(orgCache.queries.list())
                    rerunMiddleware()
                },
            }),
        signup: (client: QueryClient = useQueryClient()) =>
            mutationOptions({
                mutationKey: authCache.keys.mutations.signup(),
                mutationFn: AuthServices.signup,
                onSuccess(data) {
                    client.setQueryData(authCache.keys.queries.whoami(), data)
                    client.prefetchQuery(orgCache.queries.list())
                    rerunMiddleware()
                },
            }),
        signout: (client: QueryClient = useQueryClient()) =>
            mutationOptions({
                mutationKey: authCache.keys.mutations.signout(),
                mutationFn: AuthServices.signout,
                onSuccess: () => {
                    client.setQueryData(authCache.keys.queries.whoami(), null)
                    client.removeQueries({ queryKey: authCache.keys.queries.all() })
                    rerunMiddleware()
                },
            }),
        onboard: (client: QueryClient = useQueryClient()) =>
            mutationOptions({
                mutationKey: authCache.keys.mutations.onboard(),
                mutationFn: AuthServices.onboard,
                onSuccess: (data) => {
                    const queryKey = authCache.keys.queries.whoami()
                    client.setQueryData(queryKey, data)
                    rerunMiddleware()
                },
            }),
        refresh: (client: QueryClient = useQueryClient()) =>
            mutationOptions({
                mutationKey: authCache.keys.mutations.refresh(),
                mutationFn: AuthServices.refresh,
                onSuccess: (data) => {
                    const queryKey = authCache.keys.queries.whoami()
                    client.setQueryData(queryKey, data)
                },
            }),
    },
})
