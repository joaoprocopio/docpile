export class Env {
    IS_SERVER() {
        return import.meta.server
    }
    IS_CLIENT() {
        return import.meta.client
    }
    IS_DEV() {
        return import.meta.dev
    }
    IS_PROD() {
        return !this.IS_DEV
    }
    BASE_URL() {
        // return this.#RUNTIME_CONFIG.public.baseUrl
    }
    API_URL() {
        // return this.#RUNTIME_CONFIG.public.apiUrl
    }
    APP_NAME() {
        // return this.#RUNTIME_CONFIG.appName
    }
    AUTH_SECRET() {
        // return this.#RUNTIME_CONFIG.authSecret
    }
    DB_DSN() {
        // return this.#RUNTIME_CONFIG.dbDsn
    }
}

export const env = new Env()
