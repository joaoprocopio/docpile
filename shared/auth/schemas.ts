import * as z from "zod"

export const Email = z
    .string()
    .email("Please enter a valid email address")
    .max(320, "Exceeds maximum length of 320 characters")

export const Password = z
    .string()
    .min(8, "Your password must be at least 8 characters long")
    .max(256, "Exceeds maximum length of 256 characters")

export const DisplayName = z
    .string()
    .min(1, "Please enter your name")
    .max(256, "Exceeds maximum length of 256 characters")

export const IsOnboarded = z.boolean()

export const SignIn = z.object({
    email: Email,
    password: Password,
})

export type TSignInInput = z.input<typeof SignIn>
export type TSignInOutput = z.output<typeof SignIn>

export const SignUp = z.object({
    email: Email,
    password: Password,
    display_name: DisplayName,
})

export type TSignUpInput = z.input<typeof SignUp>
export type TSignUpOutput = z.output<typeof SignUp>

export const User = z.object({
    id: z.number(),
    email: Email,
    display_name: DisplayName,
    is_onboarded: IsOnboarded,
    created_at: z.string().datetime(),
})

export type TUserInput = z.input<typeof User>
export type TUserOutput = z.output<typeof User>

export const PublicUser = User.pick({ email: true, display_name: true, is_onboarded: true })

export type TPublicUserInput = z.input<typeof PublicUser>
export type TPublicUserOutput = z.output<typeof PublicUser>
