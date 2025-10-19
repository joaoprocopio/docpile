import { useHTTP } from "~/lib/http/clients"
import { Org, type TCreateOrgOut, type TOrgOut } from "~/state/org/schemas"

async function orgs(): Promise<TOrgOut[]> {
    const http = useHTTP()
    const response = await http("/v1/orgs")

    return Org.array().parse(response)
}

async function create(payload: TCreateOrgOut): Promise<TOrgOut> {
    const http = useHTTP()
    const response = await http("/v1/orgs", {
        method: "POST",
        body: payload,
    })

    return Org.parse(response)
}

export const OrgServices = {
    orgs,
    create,
}
