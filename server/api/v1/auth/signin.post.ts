import { defineEventHandler } from "#imports"
import { SignInInput, type TPublicUserOutput } from "#shared/auth/schemas"
import { authenticateUser } from "#shared/auth/services"
import { Errors } from "#shared/utils/errors"
import { setAuthCookies } from "#shared/utils/jwt"
import { parseBody } from "#shared/utils/validation"

/**
 * POST /api/v1/auth/signin
 *
 * Authenticates a user with email and password.
 * Sets httpOnly cookies with access and refresh tokens.
 */
export default defineEventHandler(async (event): Promise<TPublicUserOutput> => {
    const body = await parseBody(event, SignInInput)

    const user = await authenticateUser(body.email, body.password)
    if (!user) {
        throw Errors.unauthorized("Invalid email or password")
    }

    await setAuthCookies(event, user)

    return {
        email: user.email,
        display_name: user.display_name,
        is_onboarded: user.is_onboarded,
    }
})
