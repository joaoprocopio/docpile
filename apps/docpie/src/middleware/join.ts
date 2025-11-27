import { defineNuxtRouteMiddleware } from "#app"
import { invariant } from "~/lib/invariant"
import { isEmpty, isString } from "~/utils/is"

// TODO: otimizar o middleware pra exibir um estado de loading melhor
// TODO: exibir um belo estado de erro para os diferentes casos
export default defineNuxtRouteMiddleware((to) => {
    const { slug, token } = to.params

    invariant(isString(slug) && !isEmpty(slug), "Slug must me a valid string")
    invariant(isString(slug) && !isEmpty(token), "Token must be a valid string")

    return undefined
})
