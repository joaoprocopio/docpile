import { defineEventHandler, setResponseStatus } from "#imports"
import { SignUpInput, type TPublicUserOutput } from "#shared/auth/schemas"
import { createUser, isEmailTaken } from "../../../auth/services"
import { Errors } from "../../../utils/errors"
import { setAuthCookies } from "../../../utils/jwt"
import { parseBody } from "../../../utils/validation"

/**
 * POST /api/v1/auth/signup
 *
 * Creates a new user account.
 * Sets httpOnly cookies with access and refresh tokens.
 */
export default defineEventHandler(async (event): Promise<TPublicUserOutput> => {
    const body = await parseBody(event, SignUpInput)

    // Check if email is already taken
    const emailTaken = await isEmailTaken(body.email)
    if (emailTaken) {
        throw Errors.conflict(
            "auth/email-already-in-use",
            `The email ${body.email} is already taken.`,
        )
    }

    const user = await createUser(body.email, body.password, body.display_name)

    await setAuthCookies(event, user)

    setResponseStatus(event, 201)
    return {
        email: user.email,
        display_name: user.display_name,
        is_onboarded: user.is_onboarded,
    }
})
