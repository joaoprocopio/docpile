import type { StorageLike } from "@vueuse/core"
import Cookie from "js-cookie"
import { isString } from "~/utils/is"

export type CookieAttributes = typeof Cookie.attributes

export type CookieStorage = (options?: CookieAttributes) => StorageLike

export const createCookieStorage: CookieStorage = (options) => {
    return {
        getItem(key: string): string | null {
            const item = Cookie.get(key)

            if (isString(item)) {
                return item
            } else {
                return null
            }
        },
        setItem(key: string, value: string): void {
            Cookie.set(key, value, options)
        },
        removeItem(key: string): void {
            Cookie.remove(key)
        },
    }
}

export const defaultCookieStorage = createCookieStorage()
