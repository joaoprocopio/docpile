import { defineEventHandler, getRouterParam } from "#imports"
import { getInviteToken, rotateInviteToken } from "#shared/org/services"
import { requireAuth } from "#shared/utils/auth"
import { Errors } from "#shared/utils/errors"

/**
 * POST /api/v1/orgs/:slug/invite-token
 *
 * Rotates (regenerates) the invite token for the current user's membership.
 * Requires authentication and membership in the organization.
 */
export default defineEventHandler(async (event): Promise<string> => {
    const auth = requireAuth(event)
    const slug = getRouterParam(event, "slug")

    if (!slug) {
        throw Errors.badRequest("Organization slug is required")
    }

    // First check if user is a member
    const existingToken = await getInviteToken(auth.sub, slug)
    if (existingToken === null) {
        throw Errors.notFound("You are not a member of this organization")
    }

    const newToken = await rotateInviteToken(auth.sub, slug)
    if (!newToken) {
        throw Errors.internal("Failed to rotate invite token")
    }

    return newToken
})
