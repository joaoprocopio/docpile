import { defineEventHandler } from "#imports"
import type { TPublicUserOutput } from "#shared/auth/schemas"
import { createAPIError } from "#shared/utils/errors"
import { HttpStatus } from "#shared/utils/http-status"
import { isNil } from "#shared/utils/is"

export default defineEventHandler((event): TPublicUserOutput | undefined => {
    const auth = event.context.auth

    if (isNil(auth)) {
        throw createAPIError({
            code: "auth/unauthorized",
            status: HttpStatus.Unauthorized,
        })
    }

    return {
        email: auth.email,
        display_name: auth.displayName,
        is_onboarded: auth.isOnboarded,
    }
})
