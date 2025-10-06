import { defineKeyring, key, mutationOptions } from "~/lib/query/utils"
import { AuthServices } from "~/services/auth"

export const authQueries = defineKeyring({
    all: () => key("auth"),
})

export const authMutations = defineKeyring({
    all: () => key("auth"),
    signin: () =>
        mutationOptions({
            mutationKey: key("auth", "signin"),
            mutationFn: AuthServices.signin,
        }),
})
