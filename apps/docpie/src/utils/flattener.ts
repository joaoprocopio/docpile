import { isPlainObject } from "~/utils/is"

export function flatNestedObject<K extends PropertyKey, V, R extends Record<PropertyKey, unknown>>(
    obj: Record<K, V>,
): R {
    const newObj = {}

    for (const key in obj) {
        const nextVal = obj[key]

        if (isPlainObject(nextVal)) {
        }
    }

    return newObj
}
