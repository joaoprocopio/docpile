import { defineEventHandler } from "#imports"
import type { TPublicUserOutput } from "#shared/auth/schemas"

/**
 * GET /api/v1/auth/whoami
 *
 * Returns the currently authenticated user or null if not authenticated.
 */
export default defineEventHandler((event): TPublicUserOutput | null => {
    const auth = event.context.auth

    if (!auth) {
        return {
            email: "anonymous@gmail.com",
            display_name: "abc",
            is_onboarded: true,
        }
    }

    return {
        email: auth.email,
        display_name: auth.displayName,
        is_onboarded: auth.isOnboarded,
    }
})
