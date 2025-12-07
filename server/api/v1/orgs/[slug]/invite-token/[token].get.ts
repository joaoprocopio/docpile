import { defineEventHandler, getRouterParam } from "#imports"
import type { TResolvedInvitationOutput } from "#shared/org/schemas"
import { resolveInviteToken } from "../../../../../org/services"
import { Errors } from "../../../../../utils/errors"

/**
 * GET /api/v1/orgs/:slug/invite-token/:token
 *
 * Resolves an invite token to get invitation details.
 * This endpoint is public (no auth required) to allow viewing invite info.
 */
export default defineEventHandler(async (event): Promise<TResolvedInvitationOutput> => {
    const slug = getRouterParam(event, "slug")
    const token = getRouterParam(event, "token")

    if (!slug || !token) {
        throw Errors.badRequest("Organization slug and invite token are required")
    }

    const invitation = await resolveInviteToken(slug, token)
    if (!invitation) {
        throw Errors.notFound("Invalid or expired invite link")
    }

    return invitation
})
