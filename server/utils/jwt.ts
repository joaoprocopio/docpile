import {
    TOKEN_CONFIG,
    type IAccessTokenPayload,
    type IRefreshTokenPayload,
} from "#shared/auth/types"
import type { H3Event } from "h3"
import { getCookie, setCookie, deleteCookie } from "h3"
import * as jose from "jose"

// User type for token generation (minimal interface)
interface UserForToken {
    id: number
    email: string
    display_name: string
    is_onboarded: boolean
}

// Get JWT secret from environment
function getJwtSecret(): Uint8Array {
    const secret = process.env.DOCPIE_JWT_SECRET
    if (!secret) {
        throw new Error("DOCPIE_JWT_SECRET environment variable is not set")
    }
    return new TextEncoder().encode(secret)
}

// =============================================================================
// Token Generation
// =============================================================================

/**
 * Generates an access token for a user.
 */
export async function generateAccessToken(user: UserForToken): Promise<string> {
    const secret = getJwtSecret()

    const payload: Omit<IAccessTokenPayload, "iat" | "exp"> = {
        sub: user.id,
        email: user.email,
        displayName: user.display_name,
        isOnboarded: user.is_onboarded,
    }

    return new jose.SignJWT(payload as unknown as jose.JWTPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY}s`)
        .sign(secret)
}

/**
 * Generates a refresh token for a user.
 */
export async function generateRefreshToken(user: UserForToken): Promise<string> {
    const secret = getJwtSecret()

    const payload: Omit<IRefreshTokenPayload, "iat" | "exp"> = {
        sub: user.id,
        type: "refresh",
    }

    return new jose.SignJWT(payload as unknown as jose.JWTPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${TOKEN_CONFIG.REFRESH_TOKEN_EXPIRY}s`)
        .sign(secret)
}

// =============================================================================
// Token Verification
// =============================================================================

/**
 * Verifies an access token and returns the payload.
 */
export async function verifyAccessToken(token: string): Promise<IAccessTokenPayload | null> {
    try {
        const secret = getJwtSecret()
        const { payload } = await jose.jwtVerify(token, secret)
        return payload as unknown as IAccessTokenPayload
    } catch {
        return null
    }
}

/**
 * Verifies a refresh token and returns the payload.
 */
export async function verifyRefreshToken(token: string): Promise<IRefreshTokenPayload | null> {
    try {
        const secret = getJwtSecret()
        const { payload } = await jose.jwtVerify(token, secret)

        // Ensure it's a refresh token
        if ((payload as unknown as IRefreshTokenPayload).type !== "refresh") {
            return null
        }

        return payload as unknown as IRefreshTokenPayload
    } catch {
        return null
    }
}

// =============================================================================
// Cookie Management
// =============================================================================

const COOKIE_OPTIONS_BASE = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
}

/**
 * Sets authentication cookies for a user.
 */
export async function setAuthCookies(event: H3Event, user: UserForToken): Promise<void> {
    const [accessToken, refreshToken] = await Promise.all([
        generateAccessToken(user),
        generateRefreshToken(user),
    ])

    setCookie(event, TOKEN_CONFIG.ACCESS_TOKEN_COOKIE, accessToken, {
        ...COOKIE_OPTIONS_BASE,
        maxAge: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY,
    })

    setCookie(event, TOKEN_CONFIG.REFRESH_TOKEN_COOKIE, refreshToken, {
        ...COOKIE_OPTIONS_BASE,
        maxAge: TOKEN_CONFIG.REFRESH_TOKEN_EXPIRY,
    })
}

/**
 * Clears authentication cookies.
 */
export function clearAuthCookies(event: H3Event): void {
    deleteCookie(event, TOKEN_CONFIG.ACCESS_TOKEN_COOKIE, {
        ...COOKIE_OPTIONS_BASE,
    })
    deleteCookie(event, TOKEN_CONFIG.REFRESH_TOKEN_COOKIE, {
        ...COOKIE_OPTIONS_BASE,
    })
}

/**
 * Gets the access token from cookies.
 */
export function getAccessTokenFromCookie(event: H3Event): string | undefined {
    return getCookie(event, TOKEN_CONFIG.ACCESS_TOKEN_COOKIE)
}

/**
 * Gets the refresh token from cookies.
 */
export function getRefreshTokenFromCookie(event: H3Event): string | undefined {
    return getCookie(event, TOKEN_CONFIG.REFRESH_TOKEN_COOKIE)
}
