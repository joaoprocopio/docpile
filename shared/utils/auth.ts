import type { IAccessTokenPayload } from "#shared/auth/types"
import { Errors } from "./errors"
import type { H3Event } from "h3"

/**
 * Requires authentication for a route.
 * Throws 401 if not authenticated.
 */
export function requireAuth(event: H3Event): IAccessTokenPayload {
    const auth = event.context.auth
    if (!auth) {
        throw Errors.unauthorized("Authentication required")
    }
    return auth
}
