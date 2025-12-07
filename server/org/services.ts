import type { TResolvedInvitationOutput } from "#shared/org/schemas"
import { db } from "../db/client"
import {
    orgs,
    orgMembership,
    users,
    type TOrg,
    type TNewOrg,
    type TOrgMembership,
    type TNewOrgMembership,
} from "../db/schema"
import { eq, and, inArray } from "drizzle-orm"

/**
 * Lists all organizations that a user is a member of.
 */
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

/**
 * Creates a new organization and adds the creator as owner.
 */
export async function createOrg(name: string, slug: string, userId: number): Promise<TOrg> {
    // Use a transaction to ensure both org and membership are created
    const result = await db.transaction(async (tx) => {
        const newOrg: TNewOrg = {
            name,
            slug,
            status: "active",
        }

        const orgResult = await tx.insert(orgs).values(newOrg).returning()
        const org = orgResult[0]

        if (!org) {
            throw new Error("Failed to create organization")
        }

        const newMembership: TNewOrgMembership = {
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

/**
 * Gets the invite token for a user's membership in an organization.
 */
export async function getInviteToken(userId: number, orgSlug: string): Promise<string | null> {
    // First get the org by slug
    const org = await db.query.orgs.findFirst({
        where: eq(orgs.slug, orgSlug),
    })

    if (!org) {
        return null
    }

    // Then get the membership
    const membership = await db.query.orgMembership.findFirst({
        where: and(eq(orgMembership.user_id, userId), eq(orgMembership.org_id, org.id)),
    })

    return membership?.invite_token ?? null
}

/**
 * Rotates the invite token for a user's membership in an organization.
 */
export async function rotateInviteToken(userId: number, orgSlug: string): Promise<string | null> {
    // First get the org by slug
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

/**
 * Resolves an invite token to get invitation details.
 */
export async function resolveInviteToken(
    orgSlug: string,
    token: string,
): Promise<TResolvedInvitationOutput | null> {
    // Get org by slug
    const org = await db.query.orgs.findFirst({
        where: eq(orgs.slug, orgSlug),
    })

    if (!org) {
        return null
    }

    // Get membership with this token
    const membership = await db.query.orgMembership.findFirst({
        where: and(eq(orgMembership.org_id, org.id), eq(orgMembership.invite_token, token)),
    })

    if (!membership) {
        return null
    }

    // Get the inviter (user who owns this membership)
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

/**
 * Checks if an org slug is already taken.
 */
export async function isOrgSlugTaken(slug: string): Promise<boolean> {
    const org = await db.query.orgs.findFirst({
        where: eq(orgs.slug, slug),
    })
    return org !== null
}

/**
 * Gets user's membership in an organization.
 */
export async function getUserMembership(
    userId: number,
    orgId: number,
): Promise<TOrgMembership | null> {
    const membership = await db.query.orgMembership.findFirst({
        where: and(eq(orgMembership.user_id, userId), eq(orgMembership.org_id, orgId)),
    })
    return membership ?? null
}
