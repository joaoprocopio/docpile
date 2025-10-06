import { defineKeyring, key, mutationOptions } from "~/lib/query/utils"
import { AuthServices } from "~/services/auth"

export const authQueries = defineKeyring({
    all: () => key("auth"),
})

export const authMutations = defineKeyring({
    all: () => key("auth"),
    signIn: () =>
        mutationOptions({
            mutationKey: key("auth", "sign", "in"),
            mutationFn: AuthServices.signIn,
        }),
})
