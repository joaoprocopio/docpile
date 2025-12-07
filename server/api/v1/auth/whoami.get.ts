import { defineEventHandler } from "#imports"
import type { TPublicUserOutput } from "#shared/auth/schemas"

export default defineEventHandler((event): TPublicUserOutput | undefined => {
    const auth = event.context.auth

    if (!auth) {
        return undefined
    }

    return {
        email: auth.email,
        display_name: auth.displayName,
        is_onboarded: auth.isOnboarded,
    }
})
