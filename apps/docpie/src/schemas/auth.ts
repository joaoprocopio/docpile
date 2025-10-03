import { z } from "zod"

export const SigninIdentify = z.object({
    email: z
        .string({ message: "Please enter a email address" })
        .email({ message: "Please enter a valid email address" }),
})
