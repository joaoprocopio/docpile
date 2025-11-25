import { defineCache, key, mutationOptions, queryOptions } from "~/lib/cache/utils"
import { OrgServices } from "~/state/org/services"

export const orgCache = defineCache("org", {
    keys: {
        queries: {
            all: () => key("org"),
            list: () => key("org", "list"),
        },
        mutations: {
            create: () => key("org", "create"),
            inviteMembers: () => key("org", "members", "create"),
        },
    },
    queries: {
        list: () =>
            queryOptions({
                queryKey: orgCache.keys.queries.list(),
                queryFn: OrgServices.list,
            }),
    },
    mutations: {
        create: () =>
            mutationOptions({
                mutationKey: orgCache.keys.mutations.create(),
                mutationFn: OrgServices.create,
            }),
        inviteMembers: () =>
            mutationOptions({
                mutationKey: orgCache.keys.mutations.inviteMembers(),
                mutationFn: OrgServices.inviteMembers,
            }),
    },
})
