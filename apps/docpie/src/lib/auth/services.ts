import { type TSignInOut, type TUserOut, User } from "~/lib/auth/schemas"
import { useHTTP } from "~/lib/clients/http"

async function whoami(): Promise<TUserOut> {
    const http = useHTTP()
    const response = await http("/v1/auth/whoami")

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
    whoami,
    signIn,
}
