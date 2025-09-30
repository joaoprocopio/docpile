import { defineEventHandler, handleCors } from "h3"

export default defineEventHandler((event) => {
    const handledCors = handleCors(event, {
        credentials: true,
        maxAge: false,
        origin: "*",
        allowHeaders: "*",
        exposeHeaders: "*",
        methods: "*",
    })

    if (!handledCors) {
        return
    }
})
