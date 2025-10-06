import { defineEventHandler, isMethod, setResponseStatus } from "h3"

import { users } from "~/data/auth/fixtures"
import { SafeUser } from "~/data/auth/schemas"
import { HttpStatus } from "~/utils/http"

export default defineEventHandler(async (event) => {
    if (!isMethod(event, "GET")) {
        setResponseStatus(event, HttpStatus.MethodNotAllowed)
        return undefined
    }

    setResponseStatus(event, 500)

    return SafeUser.parse(users[0])
})
