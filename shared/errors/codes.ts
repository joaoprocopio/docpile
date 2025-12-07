/**
 * Error codes for the application, organized by domain.
 * Inspired by Firebase Auth error codes pattern.
 *
 * Format: "domain/error-code"
 */

export const AuthErrorCode = {
    // Authentication errors
    EMAIL_ALREADY_IN_USE: "auth/email-already-in-use",
    INVALID_CREDENTIALS: "auth/invalid-credentials",
    INVALID_EMAIL: "auth/invalid-email",
    INVALID_PASSWORD: "auth/invalid-password",
    USER_NOT_FOUND: "auth/user-not-found",
    USER_DISABLED: "auth/user-disabled",
    WEAK_PASSWORD: "auth/weak-password",

    // Token errors
    TOKEN_EXPIRED: "auth/token-expired",
    TOKEN_INVALID: "auth/token-invalid",
    TOKEN_MISSING: "auth/token-missing",
    REFRESH_TOKEN_EXPIRED: "auth/refresh-token-expired",
    REFRESH_TOKEN_INVALID: "auth/refresh-token-invalid",

    // Authorization errors
    UNAUTHORIZED: "auth/unauthorized",
    FORBIDDEN: "auth/forbidden",

    // Session errors
    SESSION_EXPIRED: "auth/session-expired",
} as const

export type TAuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode]

export const OrgErrorCode = {
    // Organization errors
    ORG_NOT_FOUND: "org/not-found",
    ORG_SLUG_TAKEN: "org/slug-already-taken",
    ORG_NAME_TAKEN: "org/name-already-taken",

    // Membership errors
    NOT_A_MEMBER: "org/not-a-member",
    ALREADY_A_MEMBER: "org/already-a-member",
    INSUFFICIENT_PERMISSIONS: "org/insufficient-permissions",

    // Invite errors
    INVITE_INVALID: "org/invite-invalid",
    INVITE_EXPIRED: "org/invite-expired",
    INVITE_NOT_FOUND: "org/invite-not-found",
} as const

export type TOrgErrorCode = (typeof OrgErrorCode)[keyof typeof OrgErrorCode]

export const CommonErrorCode = {
    // Validation errors
    VALIDATION_ERROR: "common/validation-error",
    INVALID_INPUT: "common/invalid-input",
    MISSING_REQUIRED_FIELD: "common/missing-required-field",

    // Server errors
    INTERNAL_ERROR: "common/internal-error",
    DATABASE_ERROR: "common/database-error",
    SERVICE_UNAVAILABLE: "common/service-unavailable",

    // Request errors
    BAD_REQUEST: "common/bad-request",
    NOT_FOUND: "common/not-found",
    METHOD_NOT_ALLOWED: "common/method-not-allowed",
    RATE_LIMITED: "common/rate-limited",
} as const

export type TCommonErrorCode = (typeof CommonErrorCode)[keyof typeof CommonErrorCode]

export type TErrorCode = TAuthErrorCode | TOrgErrorCode | TCommonErrorCode
