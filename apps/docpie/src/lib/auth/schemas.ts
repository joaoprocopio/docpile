import { z } from "zod/v3"

export const Email = z
    .string({ message: "Please enter an email address" })
    .email({ message: "Please enter an valid email address" })
    .max(320)

export const Password = z
    .string({ message: "Please enter an password" })
    .min(8, { message: "Must be at least 8 characters long" })
    .max(256, { message: "Exceeds maximum length of 256 characters" })

export const DisplayName = z.string().min(1).max(256)

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

export const User = z
    .object({
        email: Email,
        display_name: DisplayName,
    })
    .nullable()
