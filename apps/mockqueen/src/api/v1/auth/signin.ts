import { defineEventHandler, isMethod, readValidatedBody, setResponseStatus } from "h3"

import { users } from "~/data/auth/fixtures"
import { SafeUser, SignIn } from "~/data/auth/schemas"
import { HttpStatus } from "~/utils/http"

export default defineEventHandler(async (event) => {
    if (!isMethod(event, "POST")) {
        setResponseStatus(event, HttpStatus.MethodNotAllowed)
        return undefined
    }

    const body = await readValidatedBody(event, SignIn.parse)
    const user = users.find((user) => user.email === body.email && user.password == body.password)

    if (!user) {
        setResponseStatus(event, HttpStatus.Unauthorized)
        return undefined
    }

    return SafeUser.parse(user)
})
