import { defineNuxtRouteMiddleware } from "#app"

// TODO: otimizar o middleware pra exibir um estado de loading melhor
// TODO: exibir um belo estado de erro para os diferentes casos
export default defineNuxtRouteMiddleware((to) => {
    console.log("invite", to)
    return undefined
})
