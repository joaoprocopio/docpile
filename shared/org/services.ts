import { users } from "#shared/auth/models"
import { db } from "#shared/db"
import type { TOrg, TOrgInsert, TOrgMembership, TOrgMembershipInsert } from "#shared/org/models"
import { orgs, orgMembership } from "#shared/org/models"
import type { TResolvedInvitationOutput } from "#shared/org/schemas"
import { eq, and, inArray } from "drizzle-orm"

export async function listMemberedOrgs(userId: number): Promise<TOrg[]> {
    const memberships = await db.query.orgMembership.findMany({
        where: eq(orgMembership.user_id, userId),
    })

    const orgIds = memberships.map((m) => m.org_id)
    if (orgIds.length === 0) {
        return []
    }

    const result = await db.query.orgs.findMany({
        where: inArray(orgs.id, orgIds),
    })

    return result
}

export async function createOrg(name: string, slug: string, userId: number): Promise<TOrg> {
    const result = await db.transaction(async (tx) => {
        const newOrg: TOrgInsert = {
            name,
            slug,
            status: "active",
        }

        const orgResult = await tx.insert(orgs).values(newOrg).returning()
        const org = orgResult[0]

        if (!org) {
            throw new Error("Failed to create organization")
        }

        const newMembership: TOrgMembershipInsert = {
            user_id: userId,
            org_id: org.id,
            role: "owner",
            invite_token: crypto.randomUUID(),
        }

        await tx.insert(orgMembership).values(newMembership)

        return org
    })

    return result
}

export async function getInviteToken(userId: number, orgSlug: string): Promise<string | null> {
    const org = await db.query.orgs.findFirst({
        where: eq(orgs.slug, orgSlug),
    })

    if (!org) {
        return null
    }

    const membership = await db.query.orgMembership.findFirst({
        where: and(eq(orgMembership.user_id, userId), eq(orgMembership.org_id, org.id)),
    })

    return membership?.invite_token ?? null
}

export async function rotateInviteToken(userId: number, orgSlug: string): Promise<string | null> {
    const org = await db.query.orgs.findFirst({
        where: eq(orgs.slug, orgSlug),
    })

    if (!org) {
        return null
    }

    const newToken = crypto.randomUUID()

    const result = await db
        .update(orgMembership)
        .set({ invite_token: newToken })
        .where(and(eq(orgMembership.user_id, userId), eq(orgMembership.org_id, org.id)))
        .returning()

    if (result.length === 0) {
        return null
    }

    return newToken
}

export async function resolveInviteToken(
    orgSlug: string,
    token: string,
): Promise<TResolvedInvitationOutput | null> {
    const org = await db.query.orgs.findFirst({
        where: eq(orgs.slug, orgSlug),
    })

    if (!org) {
        return null
    }

    const membership = await db.query.orgMembership.findFirst({
        where: and(eq(orgMembership.org_id, org.id), eq(orgMembership.invite_token, token)),
    })

    if (!membership) {
        return null
    }

    const inviter = await db.query.users.findFirst({
        where: eq(users.id, membership.user_id),
    })

    if (!inviter) {
        return null
    }

    return {
        org_name: org.name,
        inviter_name: inviter.display_name,
        invite_token: token,
    }
}

export async function isOrgSlugTaken(slug: string): Promise<boolean> {
    const org = await db.query.orgs.findFirst({
        where: eq(orgs.slug, slug),
    })
    return org !== null
}

export async function getUserMembership(
    userId: number,
    orgId: number,
): Promise<TOrgMembership | null> {
    const membership = await db.query.orgMembership.findFirst({
        where: and(eq(orgMembership.user_id, userId), eq(orgMembership.org_id, orgId)),
    })
    return membership ?? null
}
