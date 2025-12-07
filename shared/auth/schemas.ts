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

export const SignInInput = z.object({
    email: Email,
    password: Password,
})

export type TSignInInputInput = z.input<typeof SignInInput>
export type TSignInInputOutput = z.output<typeof SignInInput>

export const SignUpInput = z.object({
    email: Email,
    password: Password,
    display_name: DisplayName,
})

export type TSignUpInputInput = z.input<typeof SignUpInput>
export type TSignUpInputOutput = z.output<typeof SignUpInput>

export const User = z.object({
    id: z.number(),
    email: Email,
    display_name: DisplayName,
    is_onboarded: IsOnboarded,
    created_at: z.string().datetime(),
})

export type TUserInput = z.input<typeof User>
export type TUserOutput = z.output<typeof User>

export const PublicUser = User.omit({ id: true, created_at: true })

export type TPublicUserInput = z.input<typeof PublicUser>
export type TPublicUserOutput = z.output<typeof PublicUser>

export const NullablePublicUser = PublicUser.nullable()

export type TNullablePublicUserInput = z.input<typeof NullablePublicUser>
export type TNullablePublicUserOutput = z.output<typeof NullablePublicUser>

export const AuthResponse = z.object({
    user: PublicUser,
})

export type TAuthResponseInput = z.input<typeof AuthResponse>
export type TAuthResponseOutput = z.output<typeof AuthResponse>
