import { defineEventHandler, isMethod, readValidatedBody, setResponseStatus } from "h3"

import { SignIn } from "~/data/auth/schemas"
import { HttpStatus } from "~/utils/http"

export default defineEventHandler(async (event) => {
    if (!isMethod(event, "POST")) {
        setResponseStatus(event, HttpStatus.MethodNotAllowed)
        return undefined
    }

    const body = await readValidatedBody(event, SignIn.parse)

    return body
})
