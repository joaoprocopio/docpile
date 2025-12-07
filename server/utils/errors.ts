import { createError } from "#imports"
import type { TErrorCode } from "#shared/errors/codes"
import type { IApiError, IApiValidationError } from "#shared/errors/types"
import type { H3Error } from "h3"
import type { ZodError } from "zod"

/**
 * Creates a standardized API error.
 */
export function apiError(code: TErrorCode, message: string, status: number): H3Error {
    const data: IApiError = { code, message, status }
    return createError({
        statusCode: status,
        statusMessage: message,
        data,
    })
}

/**
 * Creates a validation error from Zod errors.
 */
export function validationError(zodError: ZodError): H3Error {
    const errors: Record<string, string[]> = {}

    for (const issue of zodError.issues) {
        const path = issue.path.join(".")
        if (!errors[path]) {
            errors[path] = []
        }
        errors[path].push(issue.message)
    }

    const data: IApiValidationError = {
        code: "common/validation-error",
        message: "Validation failed",
        status: 400,
        errors,
    }

    return createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data,
    })
}

/**
 * Common error helpers.
 */
export const Errors = {
    unauthorized: (message = "Unauthorized") => apiError("auth/unauthorized", message, 401),

    forbidden: (message = "Forbidden") => apiError("auth/forbidden", message, 403),

    notFound: (message = "Not found") => apiError("common/not-found", message, 404),

    conflict: (code: TErrorCode, message: string) => apiError(code, message, 409),

    badRequest: (message = "Bad request") => apiError("common/bad-request", message, 400),

    internal: (message = "Internal server error") =>
        apiError("common/internal-error", message, 500),
}
