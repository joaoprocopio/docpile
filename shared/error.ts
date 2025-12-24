import type { AuthErrorCode } from "#shared/auth/errors"
import type { OrgErrorCode } from "#shared/org/errors"
import { asConst } from "#shared/utils/const"

export type TErrorCode = TAuthErrorCode | TOrgErrorCode | TGenericErrorCode

export type TAuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode]
export type TOrgErrorCode = (typeof OrgErrorCode)[keyof typeof OrgErrorCode]
export type TGenericErrorCode = (typeof GenericErrorCode)[keyof typeof GenericErrorCode]

export const GenericErrorCode = asConst({
    VALIDATION_ERROR: "generic/validation-error",
    DATABASE_ERROR: "generic/database-error",
})
