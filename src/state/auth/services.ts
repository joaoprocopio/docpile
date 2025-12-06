import { useHTTP } from "~/lib/http/clients"
import { type TSignInOut, type TSignUpOut, type TUserOut, User } from "~/state/auth/schemas"

async function whoami(): Promise<TUserOut> {
    const http = useHTTP()
    const response = await http("/v1/auth/whoami")

    return User.parse(response)
}

export type TSignInVariables = { payload: TSignInOut }

async function signin(variables: TSignInVariables): Promise<TUserOut> {
    const http = useHTTP()
    const response = await http("/v1/auth/signin", {
        method: "POST",
        body: variables.payload,
    })

    return User.parse(response)
}

export type TSignUpVariables = { payload: TSignUpOut }

async function signup(variables: TSignUpVariables): Promise<TUserOut> {
    const http = useHTTP()
    const response = await http("/v1/auth/signup", {
        method: "POST",
        body: variables.payload,
    })

    return User.parse(response)
}

async function signout(): Promise<void> {
    const http = useHTTP()
    const response = await http("/v1/auth/signout", {
        method: "POST",
    })

    return void response
}

async function onboard(): Promise<TUserOut> {
    const http = useHTTP()
    const response = await http("/v1/auth/onboard", {
        method: "POST",
    })

    return User.parse(response)
}

export const AuthServices = {
    whoami,
    signin,
    signup,
    signout,
    onboard,
}
