import type { TSigninIdentifyOut } from "~/schemas/auth"
import { http } from "~/services/clients/http"

async function identify(payload: TSigninIdentifyOut) {
    console.log(payload)
    http("/v1/auth/signin/identify")
}

export const AuthServices = {
    identify,
}
