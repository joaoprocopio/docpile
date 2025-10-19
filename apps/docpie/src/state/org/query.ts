import { defineKeyring, key, queryOptions } from "~/lib/query/utils"
import { OrgServices } from "~/state/org/services"

export const orgQueries = defineKeyring({
    all: () => key("org"),
    orgs: () =>
        queryOptions({
            queryKey: key("org", "orgs"),
            queryFn: OrgServices.orgs,
        }),
})
