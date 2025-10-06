import { type TSignInOut, type TUserOut, User } from "~/schemas/auth"
import { useHTTP } from "~/services/clients/http"

async function me(): Promise<TUserOut> {
    const http = useHTTP()
    const response = await http("/v1/auth/me", {
        method: "GET",
    })

    return User.parse(response)
}

async function signIn(payload: TSignInOut): Promise<TUserOut> {
    const http = useHTTP()
    const response = await http("/v1/auth/signin", {
        method: "POST",
        body: payload,
    })

    return User.parse(response)
}

export const AuthServices = {
    me,
    signIn,
}
