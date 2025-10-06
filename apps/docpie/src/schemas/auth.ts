import { z } from "zod"

export type TSigninIdentifyIn = z.input<typeof SigninIdentify>
export type TSigninIdentifyOut = z.output<typeof SigninIdentify>

export const SigninIdentify = z.object({
    email: z
        .string({ message: "Please enter a email address" })
        .email({ message: "Please enter a valid email address" }),
})
