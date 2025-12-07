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
        return import.meta.DEV
    }
    get IS_PROD() {
        return import.meta.PROD
    }
    get BASE_URL() {
        return new URL(import.meta.url)
    }
    get API_URL() {
        return this.#RUNTIME_CONFIG.public.apiUrl
    }
    get DB_PATH() {
        return this.#RUNTIME_CONFIG.dbPath
    }
    get JWT_SECRET() {
        return this.#RUNTIME_CONFIG.jwtSecret
    }
}

export const env = new Env()
