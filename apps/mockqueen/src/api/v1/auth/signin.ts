import { defineEventHandler, isMethod, readValidatedBody, setResponseStatus } from "h3"

import { Signin } from "~/data/auth/schemas"
import { HttpStatus } from "~/utils/http"

export default defineEventHandler(async (event) => {
    if (!isMethod(event, "POST")) {
        setResponseStatus(event, HttpStatus.MethodNotAllowed)
        return undefined
    }

    const body = await readValidatedBody(event, Signin.parse)

    return body
})
