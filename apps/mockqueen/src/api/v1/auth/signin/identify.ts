import { defineEventHandler, isMethod, readValidatedBody, setResponseStatus } from "h3"
import z from "zod"

import { HttpStatus } from "~/utils/http"

export default defineEventHandler(async (event) => {
    if (!isMethod(event, "POST")) {
        setResponseStatus(event, HttpStatus.MethodNotAllowed)
        return undefined
    }

    const body = await readValidatedBody(event, z.object({ email: z.email() }).parse)

    return body
})
