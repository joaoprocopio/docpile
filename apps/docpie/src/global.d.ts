/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
    type AnyFn = (...args: any[]) => any
    type AnyArray<T = any> = T[] | readonly T[]
}

export {}
