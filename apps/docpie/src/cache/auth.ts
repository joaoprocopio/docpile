import type { TKeyring } from "~/lib/query/utils"
import { mutationOptions, queryOptions } from "~/lib/query/utils"

export const authQueries = {
    all: () => ["auth"],
    detail: () =>
        queryOptions({
            queryKey: ["auth", "detail"],
            queryFn: () => Promise.resolve(),
        }),
} as const satisfies TKeyring<"query", "auth">

export const authMutations = {
    all: () => ["auth"],
    detail: () =>
        mutationOptions({
            mutationKey: ["auth", "detail"],
            mutationFn: () => Promise.resolve(),
        }),
} as const satisfies TKeyring<"mutation", "auth">
