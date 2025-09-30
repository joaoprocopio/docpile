export function isNil(subject: unknown): subject is null | undefined {
    return subject == null
}

export function isArray<T>(subject: unknown): subject is Array<T> {
    return Array.isArray(subject)
}
