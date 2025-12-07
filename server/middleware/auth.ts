import { defineEventHandler } from "#imports"
import { getUserById } from "#shared/auth/services"
import type { IAccessTokenPayload } from "#shared/auth/types"
import {
    getAccessTokenFromCookie,
    verifyAccessToken,
    getRefreshTokenFromCookie,
    verifyRefreshToken,
    setAuthCookies,
} from "#shared/utils/jwt"

declare module "h3" {
    interface H3EventContext {
        auth?: IAccessTokenPayload
    }
}

/**
 * Global middleware that populates auth context from JWT cookies.
 * Does not block requests - just adds auth info if valid token exists.
 */
export default defineEventHandler(async (event) => {
    // Skip non-API routes
    if (!event.path.startsWith("/api/v1/")) {
        return
    }

    // Try access token first
    const accessToken = getAccessTokenFromCookie(event)
    if (accessToken) {
        const payload = await verifyAccessToken(accessToken)
        if (payload) {
            event.context.auth = payload
            return
        }
    }

    // Access token invalid/expired, try refresh token
    const refreshToken = getRefreshTokenFromCookie(event)
    if (refreshToken) {
        const refreshPayload = await verifyRefreshToken(refreshToken)
        if (refreshPayload) {
            // Get fresh user data
            const user = await getUserById(refreshPayload.sub)
            if (user) {
                // Issue new tokens
                await setAuthCookies(event, user)

                // Set auth context with fresh data
                event.context.auth = {
                    sub: user.id,
                    email: user.email,
                    displayName: user.display_name,
                    isOnboarded: user.is_onboarded,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60 /* 2 hours */,
                }
            }
        }
    }
})
