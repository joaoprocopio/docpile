import {
    PublicOrg,
    InviteToken,
    NullableInviteToken,
    ResolvedInvitation,
    type TCreateOrgInputInput,
    type TPublicOrgOutput,
    type TNullableInviteTokenOutput,
    type TResolvedInvitationOutput,
} from "#shared/org/schemas"
import { useHTTP } from "~/lib/http/composables"

async function list(): Promise<TPublicOrgOutput[]> {
    const http = useHTTP()
    const response = await http("/v1/orgs")

    return PublicOrg.array().parse(response)
}

export type TCreateOrgVariables = { payload: TCreateOrgInputInput }

async function create(variables: TCreateOrgVariables): Promise<TPublicOrgOutput> {
    const http = useHTTP()
    const response = await http("/v1/orgs", {
        method: "POST",
        body: variables.payload,
    })

    return PublicOrg.parse(response)
}

export type TInviteTokenVariables = {
    slug: TPublicOrgOutput["slug"]
}

async function inviteToken(variables: TInviteTokenVariables): Promise<TNullableInviteTokenOutput> {
    const http = useHTTP()
    const response = await http(`/v1/orgs/${variables.slug}/invite-token`)

    return NullableInviteToken.parse(response)
}

export type TRotateInviteTokenVariables = {
    slug: TPublicOrgOutput["slug"]
}

async function rotateInviteToken(variables: TRotateInviteTokenVariables): Promise<string> {
    const http = useHTTP()
    const response = await http(`/v1/orgs/${variables.slug}/invite-token`, {
        method: "POST",
    })

    return InviteToken.parse(response)
}

export type TResolveInviteTokenVariables = {
    slug: TPublicOrgOutput["slug"]
    token: string
}

async function resolveInviteToken(
    variables: TResolveInviteTokenVariables,
): Promise<TResolvedInvitationOutput> {
    const http = useHTTP()
    const response = await http(`/v1/orgs/${variables.slug}/invite-token/${variables.token}`)

    return ResolvedInvitation.parse(response)
}

export const OrgServices = {
    list,
    create,
    inviteToken,
    rotateInviteToken,
    resolveInviteToken,
}
