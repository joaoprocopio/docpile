import type { TSigninIdentifyOut } from "~/schemas/auth"
import { http } from "~/services/clients/http"

async function identify(payload: TSigninIdentifyOut) {
    await http("/v1/auth/signin/identify")
    console.log(payload)
}

export const AuthServices = {
    identify,
}
