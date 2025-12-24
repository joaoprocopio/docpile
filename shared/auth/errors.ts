import { asConst } from "#shared/utils/const"

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
