import { defineEventHandler, getRouterParam } from "#imports"
import type { TNullableInviteTokenOutput } from "#shared/org/schemas"
import { getInviteToken } from "#shared/org/services"
import { requireAuth } from "#shared/utils/auth"
import { Errors } from "#shared/utils/errors"

/**
 * GET /api/v1/orgs/:slug/invite-token
 *
 * Gets the invite token for the current user's membership in the organization.
 * Requires authentication and membership in the organization.
 */
export default defineEventHandler(async (event): Promise<TNullableInviteTokenOutput> => {
    const auth = requireAuth(event)
    const slug = getRouterParam(event, "slug")

    if (!slug) {
        throw Errors.badRequest("Organization slug is required")
    }

    const token = await getInviteToken(auth.sub, slug)

    // If token is null, could mean org doesn't exist or user isn't a member
    // We return null in both cases to not leak information about org existence

    return token
})
