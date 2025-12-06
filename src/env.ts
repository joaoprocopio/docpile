import { useRuntimeConfig } from "#app"

export class Env {
    get #RUNTIME_CONFIG() {
        return useRuntimeConfig()
    }

    get IS_SERVER() {
        return import.meta.server
    }
    get IS_CLIENT() {
        return import.meta.client
    }
    get IS_DEV() {
        return import.meta.env.DEV
    }
    get IS_PROD() {
        return import.meta.env.PROD
    }
    get BASE_URL() {
        return new URL(import.meta.url)
    }
    get API_URL() {
        return this.#RUNTIME_CONFIG.public.apiUrl
    }
}

export const env = new Env()
