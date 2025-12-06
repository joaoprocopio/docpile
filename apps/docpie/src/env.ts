export const env = new (class {
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
        return import.meta.env.NUXT_PUBLIC_API_URL || "http://localhost:8000/api"
    }
})()
