import { CreateOrgInput, type TPublicOrgOutput } from "#shared/org/schemas"
import { createOrg, isOrgSlugTaken } from "../../../org/services"
import { requireAuth } from "../../../utils/auth"
import { Errors } from "../../../utils/errors"
import { parseBody } from "../../../utils/validation"
import { defineEventHandler } from "h3"

/**
 * POST /api/v1/orgs
 *
 * Creates a new organization with the current user as owner.
 * Requires authentication.
 */
export default defineEventHandler(async (event): Promise<TPublicOrgOutput> => {
    const auth = requireAuth(event)
    const body = await parseBody(event, CreateOrgInput)

    // Check if slug is already taken
    const slugTaken = await isOrgSlugTaken(body.slug)
    if (slugTaken) {
        throw Errors.conflict("org/slug-already-taken", `The slug "${body.slug}" is already taken.`)
    }

    const org = await createOrg(body.name, body.slug, auth.sub)

    return {
        name: org.name,
        slug: org.slug,
    }
})
