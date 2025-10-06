import { useRuntimeConfig } from "#app"

export const env = new (class {
    get DEV() {
        return import.meta.env.DEV
    }
    get API_URL() {
        const config = useRuntimeConfig()
        return config.public.apiUrl
    }
})()
