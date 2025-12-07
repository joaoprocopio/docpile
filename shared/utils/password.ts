import { hash, verify } from "@node-rs/argon2"

/**
 * Argon2 configuration options.
 * Using recommended settings for web applications.
 */
const ARGON2_OPTIONS = {
    memoryCost: 19456, // 19 MiB
    timeCost: 2,
    parallelism: 1,
}

/**
 * Hashes a password using Argon2id.
 */
export async function hashPassword(password: string): Promise<string> {
    return hash(password, ARGON2_OPTIONS)
}

/**
 * Verifies a password against a hash.
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await verify(hashedPassword, password, ARGON2_OPTIONS)
    } catch {
        return false
    }
}
