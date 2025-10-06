import { useRuntimeConfig } from "#app"

export function useHTTP() {
    const config = useRuntimeConfig()
    const http = $fetch.create({
        baseURL: config.public.apiUrl,
    })

    return http
}
