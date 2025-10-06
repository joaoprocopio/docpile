import { defineKeyring, key, mutationOptions, queryOptions } from "~/lib/query/utils"

export const authQueries = defineKeyring({
    all: () => key("auth"),
    detail: () =>
        queryOptions({
            queryKey: key("auth", "detail"),
            queryFn: () => Promise.resolve(),
        }),
})

export const authMutations = defineKeyring({
    all: () => key("auth"),
    detail: () =>
        mutationOptions({
            mutationKey: key("auth", "detail"),
            mutationFn: () => Promise.resolve(),
        }),
})

console.log(authQueries.detail().queryKey)
console.log(authMutations.detail().mutationKey)
