import { defineQueries } from "~/lib/query/utils"

export const authQueries = defineQueries("auth", {
    all: () => ["auth"] as const,
    detail: () => ({
        queryKey: ["auth", "detail"] as const,
        queryFn: () => Promise.resolve(),
    }),
})

// export const authMutations = defineMutations<"auth">({
//     all: () => ["auth"],
//     detail: () =>
//         mutationOptions({
//             mutationKey: ["auth", "detail"],
//             mutationFn: () => Promise.resolve(),
//         }),
// })
