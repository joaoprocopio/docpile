import { createValidationError } from "./errors"
import { readBody } from "h3"
import type { H3Event } from "h3"
import type { ZodSchema, ZodError } from "zod"

/**
 * Reads and validates the request body against a Zod schema.
 * Throws a validation error if validation fails.
 */
export async function parseBody<T>(event: H3Event, schema: ZodSchema<T>): Promise<T> {
    const body = await readBody(event)
    const result = schema.safeParse(body)

    if (!result.success) {
        throw createValidationError(result.error as ZodError)
    }

    return result.data
}
