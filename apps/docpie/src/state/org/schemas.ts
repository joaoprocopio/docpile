import { z } from "zod/v4"

import { Email } from "~/state/auth/schemas"

export type TRole = (typeof Role)[keyof typeof Role]

export const Role = {
    Owner: "owner",
    Member: "member",
} as const

export const OrgName = z
    .string()
    .nonempty("Please enter organization name")
    .max(64, "Exceeds maximum length of 64 characters")
export const OrgSlug = z
    .string()
    .min(3, "Must be at least 3 characters long")
    .max(256, "Exceeds maximum length of 256 characters")

export const OrgStatus = {
    Active: "active",
} as const

export const Org = z.object({
    name: OrgName,
    slug: OrgSlug,
    status: z.enum(OrgStatus),
})

export type TOrgIn = z.input<typeof Org>
export type TOrgOut = z.output<typeof Org>

export const CreateOrg = Org.pick({
    name: true,
    slug: true,
})

export type TCreateOrgIn = z.input<typeof CreateOrg>
export type TCreateOrgOut = z.output<typeof CreateOrg>

export const CreateInvite = z.object({
    email: Email,
    role: z.enum(Role),
})

export type TCreateInviteIn = z.input<typeof CreateInvite>
export type TCreateInviteOut = z.output<typeof CreateInvite>
