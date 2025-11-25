import { defineKeyring, key, mutationOptions, queryOptions } from "~/lib/cache/utils"
import { AuthServices } from "~/state/auth/services"

export const authCache = defineKeyring("auth")({
    keys: {
        mutations: null,
        queries: null,
    },
    queries: null,
    mutations: null,
})

// query keys
// authCache.keys.queries.all()

// mutation keys
// authCache.keys.mutations.all()

// queries
// authCache.queries.whoami()

// mutations
// authCache.queries.signIn()
// authCache.queries.signUp()
// authCache.queries.signOut()

export const authQueries = defineKeyring({
    all: () => key("auth"),
    whoami: () =>
        queryOptions({
            queryKey: key("auth", "whoami"),
            queryFn: AuthServices.whoami,
            // Will be valid as long as the user is logged in.
            staleTime: Infinity,
        }),
})

export const authMutations = defineKeyring({
    all: () => key("auth"),
    signIn: () =>
        mutationOptions({
            mutationKey: key("auth", "signin"),
            mutationFn: AuthServices.signIn,
        }),
    signUp: () =>
        mutationOptions({
            mutationKey: key("auth", "signup"),
            mutationFn: AuthServices.signUp,
        }),
    signOut: () =>
        mutationOptions({
            mutationKey: key("auth", "signout"),
            mutationFn: AuthServices.signOut,
        }),
})
