import z from "zod"

export const SignIn = z.object({ email: z.email() })
