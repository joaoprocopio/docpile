export function isNil(subject: unknown): subject is null | undefined {
    return subject == null
}

export function isString(val: unknown): val is string {
    return typeof val === "string" || val instanceof String
}

export function isArray<T>(subject: unknown): subject is Array<T> {
    return Array.isArray(subject)
}
