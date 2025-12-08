import { createError } from "#imports"
import type { TErrorCode } from "#shared/error"
import type { THttpStatus } from "#shared/utils/http-status"
import type { ZodError } from "zod"

export interface ICreateAPIError<C = unknown> {
    code: TErrorCode
    status: THttpStatus
    cause?: C
}

export function createAPIError<C = unknown>(error: ICreateAPIError<C>) {
    return createError({
        fatal: false,
        name: error.code,
        status: error.status,
        cause: error.cause,
    })
}

export function createValidationError(zodError: ZodError) {
    const errors: Record<string, string[]> = {}

    for (const issue of zodError.issues) {
        const path = issue.path.join(".")
        if (!errors[path]) {
            errors[path] = []
        }
        errors[path].push(issue.message)
    }

    const data = {
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

export const Errors = {
    unauthorized: (message = "Unauthorized") => createAPIError("auth/unauthorized", message, 401),
    forbidden: (message = "Forbidden") => createAPIError("auth/forbidden", message, 403),
    notFound: (message = "Not found") => createAPIError("common/not-found", message, 404),
    conflict: (code: TErrorCode, message: string) => createAPIError(code, message, 409),
    badRequest: (message = "Bad request") => createAPIError("common/bad-request", message, 400),
    internal: (message = "Internal server error") =>
        createAPIError("common/internal-error", message, 500),
}
