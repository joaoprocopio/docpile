import type { TOrgMembershipRoleOutput } from "./schemas"

/**
 * Role metadata for display purposes.
 */
export interface IRoleMetadata {
    value: TOrgMembershipRoleOutput
    title: string
}

/**
 * Role definitions with metadata.
 */
export const ROLES: Record<TOrgMembershipRoleOutput, IRoleMetadata> = {
    owner: {
        value: "owner",
        title: "Owner",
    },
    member: {
        value: "member",
        title: "Member",
    },
}
