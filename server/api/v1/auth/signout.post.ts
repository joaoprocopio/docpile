import { defineEventHandler, setResponseStatus } from "#imports"
import { requireAuth } from "#shared/utils/auth"
import { clearAuthCookies } from "#shared/utils/jwt"

/**
 * POST /api/v1/auth/signout
 *
 * Signs out the current user by clearing auth cookies.
 * Requires authentication.
 */
export default defineEventHandler((event): void => {
    requireAuth(event)

    clearAuthCookies(event)

    setResponseStatus(event, 204)
})
