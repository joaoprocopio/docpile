import { defineEventHandler, setResponseStatus } from "#imports"
import { SignUp, type TPublicUserOutput } from "#shared/auth/schemas"
import { createUser, isEmailTaken } from "#shared/auth/services"
import { Errors } from "#shared/utils/errors"
import { setAuthCookies } from "#shared/utils/jwt"
import { parseBody } from "#shared/utils/validation"

export default defineEventHandler(async (event): Promise<TPublicUserOutput> => {
    const body = await parseBody(event, SignUp)

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
