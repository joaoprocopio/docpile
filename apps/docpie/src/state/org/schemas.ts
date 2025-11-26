import { z } from "zod"

import { constEnum } from "~/lib/const"

export type TRole = "owner" | "member"

export const Role = constEnum<TRole, { title: string }>({
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
    { error: (issue) => `"${issue.input}" is not a valid role` },
)

export const OrgName = z
    .string()
    .nonempty("Please enter organization name")
    .max(64, "Exceeds maximum length of 64 characters")
export const OrgSlug = z
    .string()
    .min(3, "Must be at least 3 characters long")
    .max(256, "Exceeds maximum length of 256 characters")

export const Org = z.object({
    name: OrgName,
    slug: OrgSlug,
})

export type TOrgIn = z.input<typeof Org>
export type TOrgOut = z.output<typeof Org>

export const CreateOrg = Org.pick({
    name: true,
    slug: true,
})

export type TCreateOrgIn = z.input<typeof CreateOrg>
export type TCreateOrgOut = z.output<typeof CreateOrg>
