import { useHTTP } from "~/lib/http/clients"
import { type TSignInOut, type TSignUpOut, type TUserOut, User } from "~/state/auth/schemas"

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

async function signUp(payload: TSignUpOut): Promise<TUserOut> {
    const http = useHTTP()
    const response = await http("/v1/auth/signup", {
        method: "POST",
        body: payload,
    })

    return User.parse(response)
}

async function signOut(): Promise<void> {
    const http = useHTTP()
    const response = await http("/v1/auth/signout", {
        method: "POST",
    })

    return void response
}

export const AuthServices = {
    whoami,
    signIn,
    signUp,
    signOut,
}
