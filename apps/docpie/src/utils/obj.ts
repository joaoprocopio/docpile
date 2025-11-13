import { isArray, isPlainObject } from "~/utils/is"

export function flattenObject<O extends object, R extends object>(
    obj: O,
    separator: string = ".",
    prefix: string = "",
    result: Record<PropertyKey, unknown> = {},
    seen: WeakSet<object> = new WeakSet(),
): R {
    if (seen.has(obj)) {
        // Prevent circular references
        return result as R
    }

    seen.add(obj)

    for (const [key, val] of Object.entries(obj)) {
        if (!hasOwnProperty(obj, key)) {
            continue
        }

        const nextPrefix = prefix ? `${prefix}${separator}${key}` : key

        if (isPlainObject(val)) {
            flattenObject(val, separator, nextPrefix, result, seen)
        } else if (isArray(val)) {
            val.forEach((item, index) => {
                const nextArrayPrefix = `${nextPrefix}${separator}${index}`

                if (isPlainObject(item)) {
                    flattenObject(item, separator, nextArrayPrefix, result, seen)
                } else {
                    result[nextArrayPrefix] = item
                }
            })
        } else {
            result[nextPrefix] = val
        }
    }

    return result as R
}

export function hasOwnProperty<T extends object, K extends PropertyKey>(obj: T, key: K): boolean {
    return Object.hasOwn(obj, key)
}
