import type { TErrorCode } from "./codes"

/**
 * Standard API error response format.
 *
 * @example
 * {
 *   "code": "auth/email-already-in-use",
 *   "message": "The email john@doe.com is already taken.",
 *   "status": 409
 * }
 */
export interface IApiError {
    /** Error code in format "domain/error-code" */
    code: TErrorCode
    /** Human-readable error message */
    message: string
    /** HTTP status code (same as response status) */
    status: number
}

/**
 * Extended API error with optional field-level validation errors.
 */
export interface IApiValidationError extends IApiError {
    /** Field-level validation errors */
    errors?: Record<string, string[]>
}
