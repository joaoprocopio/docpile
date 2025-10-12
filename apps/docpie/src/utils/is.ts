export function isNil(value: unknown): value is null | undefined {
    return value == null
}

export function isString(value: unknown): value is string {
    return typeof value === "string" || value instanceof String
}

export function isArray<T>(value: unknown): value is Array<T> {
    return Array.isArray(value)
}

export function isEmpty(value: unknown): boolean {
    if (isNil(value)) {
        return true
    }

    if (isArray(value) || isString(value)) {
        return !value.length
    }

    if (value instanceof Map || value instanceof Set) {
        return !value.size
    }

    for (const key in value as object) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
            return false
        }
    }

    return true
}
