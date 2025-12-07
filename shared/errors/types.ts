import type { TErrorCode } from "#shared/errors/codes"
import type { THttpStatus } from "#shared/utils/http-status"

export interface IApiError {
    code: TErrorCode
    message: string
    status: THttpStatus
}

export interface IApiValidationError extends IApiError {
    errors?: Record<string, string[]>
}
