import { constEnum, constEnumToValues } from "#shared/utils/const"
import * as z from "zod"

export type TOrgMembershipRole = "owner" | "member"

export const OrgMembershipRole = constEnum<TOrgMembershipRole>({
    owner: {
        value: "owner",
    },
    member: {
        value: "member",
    },
})

export const OrgName = z
    .string()
    .min(1, "Please enter organization name")
    .max(64, "Exceeds maximum length of 64 characters")

export const OrgSlug = z
    .string()
    .min(3, "Must be at least 3 characters long")
    .max(256, "Exceeds maximum length of 256 characters")
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers, and hyphens",
    )

export const InviteToken = z.string().uuid()

export const CreateOrgInput = z.object({
    name: OrgName,
    slug: OrgSlug,
})

export type TCreateOrgInputInput = z.input<typeof CreateOrgInput>
export type TCreateOrgInputOutput = z.output<typeof CreateOrgInput>

export const Org = z.object({
    id: z.number(),
    name: OrgName,
    slug: OrgSlug,
    created_at: z.string().datetime(),
})

export type TOrgInput = z.input<typeof Org>
export type TOrgOutput = z.output<typeof Org>

export const PublicOrg = Org.omit({ id: true, created_at: true })

export type TPublicOrgInput = z.input<typeof PublicOrg>
export type TPublicOrgOutput = z.output<typeof PublicOrg>

export const OrgMembership = z.object({
    id: z.number(),
    user_id: z.number(),
    org_id: z.number(),
    role: z.enum(constEnumToValues(OrgMembershipRole)),
    invite_token: InviteToken.nullable(),
    created_at: z.string().datetime(),
})

export type TOrgMembershipInput = z.input<typeof OrgMembership>
export type TOrgMembershipOutput = z.output<typeof OrgMembership>

export const ResolvedInvitation = z.object({
    org_name: OrgName,
    inviter_name: z.string(),
    invite_token: InviteToken,
})

export type TResolvedInvitationInput = z.input<typeof ResolvedInvitation>
export type TResolvedInvitationOutput = z.output<typeof ResolvedInvitation>

// TODO: remover, trocar por erro na api
export const NullableInviteToken = InviteToken.nullable()

export type TNullableInviteTokenInput = z.input<typeof NullableInviteToken>
export type TNullableInviteTokenOutput = z.output<typeof NullableInviteToken>
