import { useRuntimeConfig } from "#imports"

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
        return import.meta.dev
    }
    get IS_PROD() {
        return !this.IS_DEV
    }
    get BASE_URL() {
        return new URL(import.meta.url)
    }
    get API_URL() {
        return this.#RUNTIME_CONFIG.public.apiUrl
    }
    get DB_DSN() {
        return this.#RUNTIME_CONFIG.dbDsn
    }
    get JWT_SECRET() {
        return this.#RUNTIME_CONFIG.jwtSecret
    }
}

export const env = new Env()
