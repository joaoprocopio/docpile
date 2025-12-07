import { defineEventHandler } from "#imports"
import type { TPublicOrgOutput } from "#shared/org/schemas"
import { listMemberedOrgs } from "../../../org/services"
import { requireAuth } from "../../../utils/auth"

/**
 * GET /api/v1/orgs
 *
 * Lists all organizations the current user is a member of.
 * Requires authentication.
 */
export default defineEventHandler(async (event): Promise<TPublicOrgOutput[]> => {
    const auth = requireAuth(event)

    const orgs = await listMemberedOrgs(auth.sub)

    return orgs.map((org) => ({
        name: org.name,
        slug: org.slug,
    }))
})
