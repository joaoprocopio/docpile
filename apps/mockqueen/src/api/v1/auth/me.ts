import { defineEventHandler, isMethod, setResponseStatus } from "h3"

import { HttpStatus } from "~/utils/http"

export default defineEventHandler(async (event) => {
    if (!isMethod(event, "GET")) {
        setResponseStatus(event, HttpStatus.MethodNotAllowed)
        return null
    }

    return "ABC"
})
