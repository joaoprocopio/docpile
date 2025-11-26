import { useHTTP } from "~/lib/http/clients"
import {
    InviteToken,
    NullableInviteToken,
    Org,
    type TCreateOrgOut,
    type TInviteTokenOut,
    type TNullableInviteTokenOut,
    type TOrgOut,
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
    orgSlug: TOrgOut["slug"]
}

async function inviteToken(variables: TInviteTokenVariables): Promise<TNullableInviteTokenOut> {
    const http = useHTTP()
    const response = await http(`/v1/orgs/${variables.orgSlug}/invite_token`)

    return NullableInviteToken.parse(response)
}

export type TRotateInviteTokenVariables = {
    orgSlug: TOrgOut["slug"]
}

async function rotateInviteToken(variables: TInviteTokenVariables): Promise<TInviteTokenOut> {
    const http = useHTTP()
    const response = await http(`/v1/orgs/${variables.orgSlug}/invite_token`, {
        method: "POST",
    })

    return InviteToken.parse(response)
}

export const OrgServices = {
    list,
    create,
    inviteToken,
    rotateInviteToken,
}
