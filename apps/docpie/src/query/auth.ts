import { defineKeyring, key, mutationOptions } from "~/lib/query/utils"
import { AuthServices } from "~/services/auth"

export const authQueries = defineKeyring({
    all: () => key("auth"),
})

export const authMutations = defineKeyring({
    all: () => key("auth"),
    identify: () =>
        mutationOptions({
            mutationKey: key("auth", "signin"),
            mutationFn: AuthServices.identify,
        }),
})
