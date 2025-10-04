import { defineMutations, defineQueries, mutationOptions, queryOptions } from "~/lib/query/utils"

export const authQueries = defineQueries<"auth">({
    all: () => ["auth"],
    detail: () =>
        queryOptions({
            queryKey: ["auth", "detail"],
            queryFn: () => Promise.resolve(),
        }),
})

export const authMutations = defineMutations<"auth">({
    all: () => ["auth"],
    detail: () =>
        mutationOptions({
            mutationKey: ["auth", "detail"],
            mutationFn: () => Promise.resolve(),
        }),
})
