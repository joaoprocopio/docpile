import z from "zod"

export const Signin = z.object({ email: z.email() })
