export function isNil(value: unknown): value is null | undefined {
    return value == null
}

export function isString(value: unknown): value is string {
    return typeof value === "string" || value instanceof String
}

export function isPlainObject<K extends PropertyKey, V>(value: unknown): value is Record<K, V> {
    return (
        Object.prototype.toString.call(value) === "[object Object]" &&
        Object.getPrototypeOf(value) === Object.prototype
    )
}

export function isArray<T>(value: unknown): value is Array<T> {
    return Array.isArray(value)
}

export function isIndexBounded<T>(array: T[], index: number): boolean {
    return index >= 0 && index < array.length
}

export function isInteger(value: unknown): value is number {
    return Number.isFinite(parseInt(value as string))
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
