import { useRuntimeConfig } from "#app"

export const env = new (class {
    get BASE_URL() {
        return new URL(import.meta.url)
    }
    get DEV() {
        return import.meta.env.DEV
    }
    get API_URL() {
        const config = useRuntimeConfig()

        return config.public.apiUrl
    }
})()
