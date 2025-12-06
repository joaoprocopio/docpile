import { useHTTP } from "~/lib/http/clients"
import {
    InviteToken,
    NullableInviteToken,
    Org,
    ResolvedInvitation,
    type TCreateOrgOut,
    type TInviteTokenOut,
    type TNullableInviteTokenOut,
    type TOrgOut,
    type TResolvedInvitationOut,
} from "~/state/org/schemas"

async function list(): Promise<TOrgOut[]> {
    const http = useHTTP()
    const response = await http("/v1/orgs")

    return Org.array().parse(response)
}

export type TCreateOrgVariables = { payload: TCreateOrgOut }

async function create(variables: TCreateOrgVariables): Promise<TOrgOut> {
    const http = useHTTP()
    const response = await http("/v1/orgs", {
        method: "POST",
        body: variables.payload,
    })

    return Org.parse(response)
}

export type TInviteTokenVariables = {
    slug: TOrgOut["slug"]
}

async function inviteToken(variables: TInviteTokenVariables): Promise<TNullableInviteTokenOut> {
    const http = useHTTP()
    const response = await http(`/v1/orgs/${variables.slug}/invite_token`)

    return NullableInviteToken.parse(response)
}

export type TRotateInviteTokenVariables = {
    slug: TOrgOut["slug"]
}

async function rotateInviteToken(variables: TInviteTokenVariables): Promise<TInviteTokenOut> {
    const http = useHTTP()
    const response = await http(`/v1/orgs/${variables.slug}/invite_token`, {
        method: "POST",
    })

    return InviteToken.parse(response)
}

export type TResolveInviteTokenVariables = {
    slug: TOrgOut["slug"]
    token: TInviteTokenOut
}

async function resolveInviteToken(
    variables: TResolveInviteTokenVariables,
): Promise<TResolvedInvitationOut> {
    const http = useHTTP()
    const response = await http(`/v1/orgs/${variables.slug}/invite_token/${variables.token}`)

    return ResolvedInvitation.parse(response)
}

export const OrgServices = {
    list,
    create,
    inviteToken,
    rotateInviteToken,
    resolveInviteToken,
}
