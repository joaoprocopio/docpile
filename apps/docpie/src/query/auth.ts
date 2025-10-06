import {
    defineMutations,
    defineQueries,
    key,
    mutationOptions,
    queryOptions,
} from "~/lib/query/utils"

export const authQueries = defineQueries({
    all: () => key("auth"),
    detail: () =>
        queryOptions({
            queryKey: key("auth", 123),
            queryFn: () => Promise.resolve(),
        }),
})

export const authMutations = defineMutations({
    all: () => key("auth"),
    detail: () =>
        mutationOptions({
            mutationKey: key("auth", 123),
            mutationFn: () => Promise.resolve(),
        }),
})
