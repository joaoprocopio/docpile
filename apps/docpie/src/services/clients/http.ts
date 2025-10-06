import { useRuntimeConfig } from "#app"

export const http = $fetch.create({
    baseURL: useRuntimeConfig().public.apiUrl,
})
