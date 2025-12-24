import { defineEventHandler, toWebRequest } from "#imports"
import { auth } from "#server/auth/services"

export default defineEventHandler((event) => {
    return auth.handler(toWebRequest(event))
})
