import { useHTTP } from "~/lib/http/clients"
import {
    InviteToken,
    Org,
    type TCreateOrgOut,
    type TInviteTokenOut,
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

async function inviteToken(variables: TInviteTokenVariables): Promise<TInviteTokenOut> {
    const http = useHTTP()
    const response = await http(`/v1/orgs/${variables.orgSlug}/invite_token`)

    return InviteToken.parse(response)
}

export const OrgServices = {
    list,
    create,
    inviteToken,
}
