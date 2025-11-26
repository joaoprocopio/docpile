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

async function create(variables: { payload: TCreateOrgOut }): Promise<TOrgOut> {
    const http = useHTTP()
    const response = await http("/v1/orgs", {
        method: "POST",
        body: variables.payload,
    })

    return Org.parse(response)
}

async function inviteToken(slug = "TODO"): Promise<TInviteTokenOut> {
    const http = useHTTP()
    const response = await http(`/v1/orgs/${slug}/invite_token`)

    return InviteToken.parse(response)
}

export const OrgServices = {
    list,
    create,
    inviteToken,
}
