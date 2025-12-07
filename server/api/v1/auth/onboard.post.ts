import { defineEventHandler } from "#imports"
import type { TPublicUserOutput } from "#shared/auth/schemas"
import { onboardUser } from "#shared/auth/services"
import { requireAuth } from "#shared/utils/auth"
import { setAuthCookies } from "#shared/utils/jwt"

/**
 * POST /api/v1/auth/onboard
 *
 * Marks the current user as onboarded.
 * Requires authentication.
 */
export default defineEventHandler(async (event): Promise<TPublicUserOutput> => {
    const auth = requireAuth(event)

    const user = await onboardUser(auth.sub)

    // Refresh tokens with updated onboarding status
    await setAuthCookies(event, user)

    return {
        email: user.email,
        display_name: user.display_name,
        is_onboarded: user.is_onboarded,
    }
})
