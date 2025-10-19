import { useHTTP } from "~/lib/http/clients"
import { Org, type TOrgOut } from "~/state/org/schemas"

async function orgs(): Promise<TOrgOut[]> {
    const http = useHTTP()
    const response = await http("/v1/orgs")

    return Org.array().parse(response)
}

export const OrgServices = {
    orgs,
}
