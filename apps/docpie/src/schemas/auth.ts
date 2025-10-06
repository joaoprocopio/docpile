import { z } from "zod/v3"

export const Email = z
    .string({ message: "Please enter a email address" })
    .email({ message: "Please enter a valid email address" })
    .max(320)

export const Password = z
    .string({ message: "Please enter a password" })
    .min(8, { message: "Must be at least 8 characters long" })
    .max(256, { message: "Exceeds maximum length of 256 characters" })

export type TSignInIn = z.input<typeof SignIn>
export type TSignInOut = z.output<typeof SignIn>

export const SignIn = z.object({
    email: Email,
    password: Password,
})

export type TSignUpIn = z.input<typeof SignUp>
export type TSignUpOut = z.output<typeof SignUp>

export const SignUp = z.object({
    email: Email,
    password: Password,
})

export type TUserIn = z.input<typeof User>
export type TUserOut = z.output<typeof User>

export const User = z.object({
    email: Email,
    first_name: z.string(),
    last_name: z.string(),
    full_name: z.string(),
})
