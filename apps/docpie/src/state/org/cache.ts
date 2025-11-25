import { defineKeyring, key, mutationOptions, queryOptions } from "~/lib/cache/utils"
import { OrgServices } from "~/state/org/services"

export const orgQueries = defineKeyring({
    all: () => key("org"),
    orgs: () =>
        queryOptions({
            queryKey: key("org", "list"),
            queryFn: OrgServices.list,
        }),
})

export const orgMutations = defineKeyring({
    all: () => key("org"),
    create: () =>
        mutationOptions({
            mutationKey: key("org", "create"),
            mutationFn: OrgServices.create,
        }),
    inviteMembers: () =>
        mutationOptions({
            mutationKey: key("org", "members", "invite"),
            mutationFn: OrgServices.inviteMembers,
        }),
})
