// @ts-nocheck
import { isArray, isPlainObject } from "~/utils/is"

export function flattenObject(obj) {
    const flatObj = {}

    for (const key in obj) {
        const val = obj[key]

        if (isArray(val)) {
            for (const innerVal of val) {
                console.log(innerVal)
            }

            continue
        }

        if (isPlainObject(val)) {
            continue
        }

        flatObj[key] = val
    }

    return flatObj
}
