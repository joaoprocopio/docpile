import { isArray, isPlainObject } from "~/utils/is"

export function flattenObject<O extends object, R extends object = Record<string, unknown>>(
    obj: O,
    separator: string = ".",
    prefix: string = "",
    result: Record<PropertyKey, unknown> = {},
): R {
    for (const key in obj) {
        if (!hasOwnProperty(obj, key)) {
            continue
        }

        const nextPrefix = prefix ? `${prefix}${separator}${key}` : key
        const val = obj[key]

        if (isPlainObject(val)) {
            flattenObject(val, separator, nextPrefix, result)
        } else if (isArray(val)) {
            val.forEach((item, index) => {
                const arrayKey = `${nextPrefix}${separator}${index}`

                if (isPlainObject(item)) {
                    flattenObject(item, separator, arrayKey, result)
                } else {
                    result[arrayKey] = item
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
