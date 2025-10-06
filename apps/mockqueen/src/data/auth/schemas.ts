import z from "zod"

export const Identify = z.object({ email: z.email() })
