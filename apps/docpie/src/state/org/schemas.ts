import { z } from "zod/v4"

import { asConst } from "~/lib/enum"
import { Email } from "~/state/auth/schemas"

export type TRole = "owner" | "member"

export const Role = asConst<TRole, { title: string }>({
    owner: {
        value: "owner",
        title: "Owner",
    },
    member: {
        value: "member",
        title: "Member",
    },
})

export const RoleUnion = z.union(
    Object.values(Role).map((role) => z.literal(role.value)),
    { error: (issue) => `Role must ${issue.values.join(" or ")}, found ${issue.input}` },
)

export const OrgName = z
    .string()
    .nonempty("Please enter organization name")
    .max(64, "Exceeds maximum length of 64 characters")
export const OrgSlug = z
    .string()
    .min(3, "Must be at least 3 characters long")
    .max(256, "Exceeds maximum length of 256 characters")

export type TOrgStatus = "active"

export const OrgStatus = asConst<TOrgStatus>({
    active: {
        value: "active",
    },
})

export const OrgStatusUnion = z.union(
    Object.values(OrgStatus).map((status) => z.literal(status.value)),
)

export const Org = z.object({
    name: OrgName,
    slug: OrgSlug,
    status: OrgStatusUnion,
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
    role: RoleUnion,
})

export type TCreateInviteIn = z.input<typeof CreateInvite>
export type TCreateInviteOut = z.output<typeof CreateInvite>

export const CreateInviteMultiline = CreateInvite.extend({ email: z.string() })
    .transform((value) =>
        value.email
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((email) => ({
                email: email,
                role: value.role,
            })),
    )
    .pipe(CreateInvite.array())

export type TCreateInviteMultilineIn = z.input<typeof CreateInviteMultiline>
export type TCreateInviteMultilineOut = z.output<typeof CreateInviteMultiline>
