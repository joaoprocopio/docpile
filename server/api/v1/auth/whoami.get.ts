import type { TPublicUserOutput } from "#shared/auth/schemas"
import { defineEventHandler } from "h3"

/**
 * GET /api/v1/auth/whoami
 *
 * Returns the currently authenticated user or null if not authenticated.
 */
export default defineEventHandler((event): TPublicUserOutput | null => {
    const auth = event.context.auth
    if (!auth) {
        return null
    }

    return {
        email: auth.email,
        display_name: auth.displayName,
        is_onboarded: auth.isOnboarded,
    }
})
