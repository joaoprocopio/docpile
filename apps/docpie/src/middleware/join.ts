import { defineNuxtRouteMiddleware } from "#app"

// TODO: otimizar o middleware pra exibir um estado de loading melhor
// TODO: exibir um belo estado de erro para os diferentes casos
export default defineNuxtRouteMiddleware(() => {
    // aqui a gente tem o token. eh só bater no backend, pegar o nome do cara, o nome da org, redireciona pra tela de login.
    // altera o fluxo um pouco, ele vai fazer o cadastro normal, vai pular a etapa de criar a org e ir direto pro onboarding.

    return undefined
})
