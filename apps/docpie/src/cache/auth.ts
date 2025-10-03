import { defineMutations, defineQueries, mutationOptions, queryOptions } from "~/lib/query/utils"

export const authQueries = defineQueries("auth", {
    current: () =>
        queryOptions({
            queryKey: ["auth"],
            queryFn: () => Promise.resolve(),
        }),
})

export const authMutations = defineMutations("auth", {
    identify: () =>
        mutationOptions({
            mutationKey: ["auth"],
            mutationFn: () => Promise.resolve(),
        }),
})
