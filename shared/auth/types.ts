/**
 * JWT Access Token payload structure.
 */
export interface IAccessTokenPayload {
    /** Subject - User ID */
    sub: number
    /** User email */
    email: string
    /** User display name */
    displayName: string
    /** Whether user has completed onboarding */
    isOnboarded: boolean
    /** Issued at timestamp */
    iat: number
    /** Expiration timestamp */
    exp: number
}

/**
 * JWT Refresh Token payload structure.
 */
export interface IRefreshTokenPayload {
    /** Subject - User ID */
    sub: number
    /** Token type identifier */
    type: "refresh"
    /** Issued at timestamp */
    iat: number
    /** Expiration timestamp */
    exp: number
}

/**
 * Token configuration constants.
 */
export const TOKEN_CONFIG = {
    /** Access token expiry in seconds (2 hours) */
    ACCESS_TOKEN_EXPIRY: 2 * 60 * 60,
    /** Refresh token expiry in seconds (30 days) */
    REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60,
    /** Access token cookie name */
    ACCESS_TOKEN_COOKIE: "access_token",
    /** Refresh token cookie name */
    REFRESH_TOKEN_COOKIE: "refresh_token",
} as const
