import { defineKeyring, key, mutationOptions, queryOptions } from "~/lib/query/utils"
import { AuthServices } from "~/state/auth/services"

export const authQueries = defineKeyring({
    all: () => key("auth"),
    whoami: () =>
        queryOptions({
            queryKey: key("auth", "whoami"),
            queryFn: AuthServices.whoami,
            staleTime: Infinity,
        }),
})

export const authMutations = defineKeyring({
    all: () => key("auth"),
    signIn: () =>
        mutationOptions({
            mutationKey: key("auth", "sign", "in"),
            mutationFn: AuthServices.signIn,
        }),
    signUp: () =>
        mutationOptions({
            mutationKey: key("auth", "sign", "up"),
            mutationFn: AuthServices.signUp,
        }),
})
