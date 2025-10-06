import z from "zod"

export type TSignInIn = z.output<typeof SignIn>
export type TSignInOut = z.output<typeof SignIn>

export const SignIn = z.object({
    email: z.string(),
    password: z.string(),
})

export type TUserIn = z.output<typeof User>
export type TUserOut = z.output<typeof User>

export const User = z.object({
    id: z.int(),
    email: z.string(),
    password: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    full_name: z.string(),
})

export type TSafeUserIn = z.output<typeof SafeUser>
export type TSafeUserOut = z.output<typeof SafeUser>

export const SafeUser = User.omit({
    id: true,
    password: true,
})
