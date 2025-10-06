import type { TSigninOut } from "~/schemas/auth"
import { http } from "~/services/clients/http"

async function signin(payload: TSigninOut) {
    const response = await http("/v1/auth/signin", {
        method: "POST",
        body: payload,
    })

    return response
}

export const AuthServices = {
    signin,
}
