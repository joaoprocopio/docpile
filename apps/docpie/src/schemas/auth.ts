import { z } from "zod/v3"

export const Email = z
    .string({ message: "Please enter a email address" })
    .email({ message: "Please enter a valid email address" })
    .max(320)

export const Password = z.string().min(1).max(256)

export type TSigninIdentifyIn = z.input<typeof SigninIdentify>
export type TSigninIdentifyOut = z.output<typeof SigninIdentify>

export const SigninIdentify = z.object({
    email: Email,
})

export const Signup = z.object({
    email: Email,
    password: Password,
})
