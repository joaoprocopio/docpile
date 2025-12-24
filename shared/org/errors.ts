import { asConst } from "#shared/utils/const"

export const OrgErrorCode = asConst({
    ORG_NOT_FOUND: "org/not-found",
    ORG_SLUG_TAKEN: "org/slug-already-taken",
    ORG_NAME_TAKEN: "org/name-already-taken",
    NOT_A_MEMBER: "org/not-a-member",
    ALREADY_A_MEMBER: "org/already-a-member",
    INSUFFICIENT_PERMISSIONS: "org/insufficient-permissions",
    INVITE_INVALID: "org/invite-invalid",
    INVITE_EXPIRED: "org/invite-expired",
    INVITE_NOT_FOUND: "org/invite-not-found",
})
