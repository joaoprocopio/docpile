import { defineMutations, defineQueries, mutationOptions, queryOptions } from "~/lib/query/utils"

export const authQueries = defineQueries<"auth">()({
    all: () => ["auth"],
    detail: () =>
        queryOptions({
            queryKey: ["auth", "detail"] as const,
            queryFn: () => Promise.resolve(),
        }),
})

export const authMutations = defineMutations<"auth">()({
    all: () => ["auth"],
    detail: () =>
        mutationOptions({
            mutationKey: ["auth", "detail"] as const,
            mutationFn: () => Promise.resolve(),
        }),
})
