import { defineEventHandler } from "#imports"
import type { TPublicUserOutput } from "#shared/auth/schemas"
import { getUserById } from "../../../auth/services"
import { Errors } from "../../../utils/errors"
import {
    getRefreshTokenFromCookie,
    verifyRefreshToken,
    setAuthCookies,
    clearAuthCookies,
} from "../../../utils/jwt"

/**
 * POST /api/v1/auth/refresh
 *
 * Refreshes the access token using the refresh token.
 * Issues new access and refresh tokens.
 */
export default defineEventHandler(async (event): Promise<TPublicUserOutput> => {
    const refreshToken = getRefreshTokenFromCookie(event)
    if (!refreshToken) {
        throw Errors.unauthorized("No refresh token provided")
    }

    const payload = await verifyRefreshToken(refreshToken)
    if (!payload) {
        clearAuthCookies(event)
        throw Errors.unauthorized("Invalid or expired refresh token")
    }

    const user = await getUserById(payload.sub)
    if (!user) {
        clearAuthCookies(event)
        throw Errors.unauthorized("User not found")
    }

    await setAuthCookies(event, user)

    return {
        email: user.email,
        display_name: user.display_name,
        is_onboarded: user.is_onboarded,
    }
})
