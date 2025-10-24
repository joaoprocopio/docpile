import { z } from "zod/v4"

export const Email = z
    .email("Please enter an valid email address")
    .max(320, "Exceeds maximum length of 320 characters")

export const Password = z
    .string()
    .min(8, "Your password must be at least 8 characters long")
    .max(256, "Exceeds maximum length of 256 characters")

export const DisplayName = z
    .string()
    .nonempty("Please enter your name")
    .max(256, "Exceeds maximum length of 256 characters")

export const IsOnboarded = z.boolean()

export type TSignInIn = z.input<typeof SignIn>
export type TSignInOut = z.output<typeof SignIn>

export const SignIn = z.object({
    email: Email,
    password: Password,
})

export type TSignUpIn = z.input<typeof SignUp>
export type TSignUpOut = z.output<typeof SignUp>

export const SignUp = z.object({
    display_name: DisplayName,
    email: Email,
    password: Password,
})

export type TUserIn = z.input<typeof User>
export type TUserOut = z.output<typeof User>

export const User = z
    .object({
        email: Email,
        display_name: DisplayName,
        is_onboarded: IsOnboarded,
    })
    .nullable()
