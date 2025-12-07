import { SignInInput, type TPublicUserOutput } from "#shared/auth/schemas"
import { authenticateUser } from "../../../auth/services"
import { Errors } from "../../../utils/errors"
import { setAuthCookies } from "../../../utils/jwt"
import { parseBody } from "../../../utils/validation"
import { defineEventHandler } from "h3"

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
