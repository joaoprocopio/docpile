export function isNil(value: unknown): value is null | undefined {
    return value == null
}

export function isString(value: unknown): value is string {
    return typeof value === "string" || value instanceof String
}

export function isArray<T>(value: unknown): value is Array<T> {
    return Array.isArray(value)
}
