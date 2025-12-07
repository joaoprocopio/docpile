/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "#shared/env"

const isProduction: boolean = env.IS_PROD
const prefix: string = "Invariant failed"

export function invariant(condition: any, message?: string | (() => string)): asserts condition {
    if (condition) {
        return
    }

    if (isProduction) {
        throw new Error(prefix)
    }

    const provided: string | undefined = typeof message === "function" ? message() : message
    const value: string = provided ? `${prefix}: ${provided}` : prefix

    throw new Error(value)
}
