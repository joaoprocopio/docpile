import type { TIdentifyOut } from "~/schemas/auth"
import { http } from "~/services/clients/http"

async function identify(payload: TIdentifyOut) {
    const response = await http("/v1/auth/signin/identify", {
        method: "POST",
        body: payload,
    })

    return response
}

export const AuthServices = {
    identify,
}
