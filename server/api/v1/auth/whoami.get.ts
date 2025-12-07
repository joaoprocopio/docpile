import { defineEventHandler } from "#imports"
import type { TPublicUserOutput } from "#shared/auth/schemas"
import { Errors } from "#shared/utils/errors"
import { isNil } from "#shared/utils/is"

export default defineEventHandler((event): TPublicUserOutput | undefined => {
    const auth = event.context.auth

    if (isNil(auth)) {
        throw Errors.unauthorized()
    }

    return {
        email: auth.email,
        display_name: auth.displayName,
        is_onboarded: auth.isOnboarded,
    }
})
