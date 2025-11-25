import { defineCache, key, mutationOptions, queryOptions } from "~/lib/cache/utils"
import { AuthServices } from "~/state/auth/services"

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
        signin: () =>
            mutationOptions({
                mutationKey: authCache.keys.mutations.signin(),
                mutationFn: AuthServices.signIn,
            }),
        signup: () =>
            mutationOptions({
                mutationKey: authCache.keys.mutations.signup(),
                mutationFn: AuthServices.signUp,
            }),
        signout: () =>
            mutationOptions({
                mutationKey: authCache.keys.mutations.signout(),
                mutationFn: AuthServices.signOut,
            }),
    },
})

export const authQueries = {}

export const authMutations = {}
