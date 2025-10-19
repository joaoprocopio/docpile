import { useRuntimeConfig } from "#app"

export const env = new (class {
    get HOST() {
        return new URL(import.meta.url).host
    }
    get DEV() {
        return import.meta.env.DEV
    }
    get API_URL() {
        const config = useRuntimeConfig()

        return config.public.apiUrl
    }
})()
