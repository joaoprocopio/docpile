import {
    NullablePublicUser,
    PublicUser,
    type TSignInInputInput,
    type TSignUpInputInput,
    type TPublicUserOutput,
    type TNullablePublicUserOutput,
} from "#shared/auth/schemas"
import { useHTTP } from "~/lib/http/clients"

async function whoami(): Promise<TNullablePublicUserOutput> {
    const http = useHTTP()
    const response = await http("/v1/auth/whoami")

    return NullablePublicUser.parse(response)
}

export type TSignInVariables = { payload: TSignInInputInput }

async function signin(variables: TSignInVariables): Promise<TPublicUserOutput> {
    const http = useHTTP()
    const response = await http("/v1/auth/signin", {
        method: "POST",
        body: variables.payload,
    })

    return PublicUser.parse(response)
}

export type TSignUpVariables = { payload: TSignUpInputInput }

async function signup(variables: TSignUpVariables): Promise<TPublicUserOutput> {
    const http = useHTTP()
    const response = await http("/v1/auth/signup", {
        method: "POST",
        body: variables.payload,
    })

    return PublicUser.parse(response)
}

async function signout(): Promise<void> {
    const http = useHTTP()
    await http("/v1/auth/signout", {
        method: "POST",
    })
}

async function onboard(): Promise<TPublicUserOutput> {
    const http = useHTTP()
    const response = await http("/v1/auth/onboard", {
        method: "POST",
    })

    return PublicUser.parse(response)
}

async function refresh(): Promise<TPublicUserOutput> {
    const http = useHTTP()
    const response = await http("/v1/auth/refresh", {
        method: "POST",
    })

    return PublicUser.parse(response)
}

export const AuthServices = {
    whoami,
    signin,
    signup,
    signout,
    onboard,
    refresh,
}
