import { defineKeyring, key, mutationOptions, queryOptions } from "~/lib/query/utils"
import { OrgServices } from "~/state/org/services"

export const orgQueries = defineKeyring({
    all: () => key("org"),
    orgs: () =>
        queryOptions({
            queryKey: key("org", "orgs"),
            queryFn: OrgServices.orgs,
        }),
})

export const orgMutations = defineKeyring({
    all: () => key("org"),
    create: () =>
        mutationOptions({
            mutationKey: key("org", "create"),
            mutationFn: OrgServices.create,
        }),
})
