import { asConst } from "#shared/utils/const"

export type TErrorCode = TAuthErrorCode | TOrgErrorCode | TGenericErrorCode

export type TAuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode]
export type TOrgErrorCode = (typeof OrgErrorCode)[keyof typeof OrgErrorCode]
export type TGenericErrorCode = (typeof GenericErrorCode)[keyof typeof GenericErrorCode]

export const AuthErrorCode = asConst({
    EMAIL_ALREADY_IN_USE: "auth/email-already-in-use",
    INVALID_CREDENTIALS: "auth/invalid-credentials",
    INVALID_EMAIL: "auth/invalid-email",
    INVALID_PASSWORD: "auth/invalid-password",
    USER_NOT_FOUND: "auth/user-not-found",
    USER_DISABLED: "auth/user-disabled",
    WEAK_PASSWORD: "auth/weak-password",
    TOKEN_EXPIRED: "auth/token-expired",
    TOKEN_INVALID: "auth/token-invalid",
    TOKEN_MISSING: "auth/token-missing",
    REFRESH_TOKEN_EXPIRED: "auth/refresh-token-expired",
    REFRESH_TOKEN_INVALID: "auth/refresh-token-invalid",
    UNAUTHORIZED: "auth/unauthorized",
    FORBIDDEN: "auth/forbidden",
    SESSION_EXPIRED: "auth/session-expired",
})

export const OrgErrorCode = asConst({
    ORG_NOT_FOUND: "org/not-found",
    ORG_SLUG_TAKEN: "org/slug-already-taken",
    ORG_NAME_TAKEN: "org/name-already-taken",
    NOT_A_MEMBER: "org/not-a-member",
    ALREADY_A_MEMBER: "org/already-a-member",
    INSUFFICIENT_PERMISSIONS: "org/insufficient-permissions",
    INVITE_INVALID: "org/invite-invalid",
    INVITE_EXPIRED: "org/invite-expired",
    INVITE_NOT_FOUND: "org/invite-not-found",
})

export const GenericErrorCode = asConst({
    VALIDATION_ERROR: "generic/validation-error",
    DATABASE_ERROR: "generic/database-error",
})
