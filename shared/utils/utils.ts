/**
 * Generates a UUID v4 using the crypto API.
 */
export function generateUUID(): string {
    return crypto.randomUUID()
}

/**
 * Checks if a value is a non-null object.
 */
export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Safely parses JSON, returning null on failure.
 */
export function safeJsonParse<T>(json: string): T | null {
    try {
        return JSON.parse(json) as T
    } catch {
        return null
    }
}
