import { useHTTP } from "~/lib/http/clients"
import {
    Org,
    type TCreateInviteMultilineOut,
    type TCreateInviteOut,
    type TCreateOrgOut,
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

async function inviteMembers(variables: {
    slug: TOrgOut["slug"]
    payload: TCreateInviteOut[] | TCreateInviteMultilineOut
}): Promise<void> {
    const http = useHTTP()
    const response = await http(`/v1/orgs/${variables.slug}/members`, {
        method: "POST",
        body: variables.payload,
    })

    return void response
}

export const OrgServices = {
    list,
    create,
    inviteMembers,
}
