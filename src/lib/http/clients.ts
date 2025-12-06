import { env } from "~/env"

export function useHTTP() {
    const http = $fetch.create({
        baseURL: env.API_URL,
        credentials: "include",
    })

    return http
}
