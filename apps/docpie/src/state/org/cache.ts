import { defineCache, key, mutationOptions, queryOptions } from "~/lib/cache/utils"
import type { TOrgOut } from "~/state/org/schemas"
import { OrgServices } from "~/state/org/services"

export const orgCache = defineCache("org")({
    keys: {
        queries: {
            all: () => key("org"),
            list: () => key("org", "list"),
            inviteToken: (args: TInviteTokenArgs) => key("org", "invite-token", args),
        },
        mutations: {
            create: () => key("org", "create"),
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
    },
})

export type TInviteTokenArgs = {
    orgSlug: TOrgOut["slug"]
}
