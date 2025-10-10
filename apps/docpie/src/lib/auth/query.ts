import { AuthServices } from "~/lib/auth/services"
import { defineKeyring, key, mutationOptions, queryOptions } from "~/lib/query/utils"

export const authQueries = defineKeyring({
    all: () => key("auth"),
    whoami: () =>
        queryOptions({
            queryKey: key("auth", "whoami"),
            queryFn: AuthServices.whoami,
        }),
})

export const authMutations = defineKeyring({
    all: () => key("auth"),
    signIn: () =>
        mutationOptions({
            mutationKey: key("auth", "sign", "in"),
            mutationFn: AuthServices.signIn,
        }),
})
