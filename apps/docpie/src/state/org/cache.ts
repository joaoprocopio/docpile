import { defineCache, key, mutationOptions, queryOptions } from "~/lib/cache/utils"
import { OrgServices, type TInviteTokenVariables } from "~/state/org/services"

export const orgCache = defineCache("org")({
    keys: {
        queries: {
            all: () => key("org"),
            list: () => key("org", "list"),
            inviteToken: (variables: TInviteTokenVariables) =>
                key("org", "invite-token", variables),
        },
        mutations: {
            create: () => key("org", "create"),
            rotateInviteToken: () => key("org", "invite-token", "rotate"),
        },
    },
    queries: {
        list: () =>
            queryOptions({
                queryKey: orgCache.keys.queries.list(),
                queryFn: OrgServices.list,
            }),
        inviteToken: (variables: TInviteTokenVariables) =>
            queryOptions({
                queryKey: orgCache.keys.queries.inviteToken(variables),
                queryFn: () => OrgServices.inviteToken(variables),
            }),
    },
    mutations: {
        create: () =>
            mutationOptions({
                mutationKey: orgCache.keys.mutations.create(),
                mutationFn: OrgServices.create,
            }),
        rotateInviteToken: () =>
            mutationOptions({
                mutationKey: orgCache.keys.mutations.rotateInviteToken(),
                mutationFn: OrgServices.rotateInviteToken,
            }),
    },
})
