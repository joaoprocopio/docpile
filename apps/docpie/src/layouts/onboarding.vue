<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query"
import { useDebounceFn } from "@vueuse/core"
import { computed } from "vue"

import { useRoute, useRouter } from "#app"
import { UserMenu } from "~/components/user-menu"
import { asConst } from "~/lib/const"
import { OrgRoutes } from "~/lib/router/constants"
import { buttonVariants } from "~/lib/ui/button"
import { PageControl, PageControlItem, PageControlTrigger } from "~/lib/ui/page-control"
import { authCache } from "~/state/auth/cache"
import { provideOnboarding } from "~/state/org/composables"
import { isNil } from "~/utils/is"

const router = useRouter()
const route = useRoute()
const onboard = useMutation(authCache.mutations.onboard())

const steps = asConst([
    OrgRoutes.Onboarding.Intro,
    OrgRoutes.Onboarding.Theme,
    OrgRoutes.Onboarding.Invite,
])

const index = computed<number>(() => steps.findIndex((step) => step === route.name))

const stepping = computed<boolean>(() => index.value !== -1)

const go = (index: number) => {
    const nextRoute = steps[index]

    if (isNil(nextRoute)) return undefined

    router.push({ name: nextRoute })
}

const prev = () => {
    const prevIndex = index.value - 1
    const prevRoute = steps[prevIndex]

    if (isNil(prevRoute)) return undefined

    router.push({ name: prevRoute })
}

const next = () => {
    const nextIndex = index.value + 1

    if (nextIndex > steps.length - 1) {
        return finish()
    }

    const nextRoute = steps[nextIndex]

    if (isNil(nextRoute)) return undefined

    router.push({ name: nextRoute })
}

const finish = useDebounceFn(() => {
    onboard.mutate()
})

provideOnboarding({
    steps: steps,
    index: index,
    go: go,
    prev: prev,
    next: next,
})
</script>

<template>
    <div
        class="grid h-full grid-cols-1 grid-rows-[auto_1fr_auto]"
        style="--topbar-height: 3.5rem; --bottombar-height: 3.5rem">
        <div
            class="fixed top-0 right-1/2 z-10 flex h-(--topbar-height) translate-x-1/2 flex-col justify-center sm:right-0 sm:translate-x-0">
            <UserMenu class="bg-background/40 backdrop-blur" />
        </div>

        <div
            :data-stepping="stepping ? '' : undefined"
            class="pt-(--topbar-height) data-stepping:pb-(--bottombar-height)">
            <div class="mx-auto max-w-md px-6 py-10">
                <slot />
            </div>
        </div>

        <div
            v-if="stepping"
            class="fixed right-1/2 bottom-0 z-10 flex h-(--bottombar-height) translate-x-1/2 flex-col items-center justify-center">
            <PageControl
                class="rounded-lg bg-background/40 px-2 py-1 backdrop-blur"
                :model-value="(() => route.name as string)()">
                <template
                    v-for="(onboardingRoute, onboardingRouteIndex) in steps"
                    :key="onboardingRouteIndex">
                    <PageControlTrigger
                        v-if="onboardingRouteIndex <= index"
                        :value="onboardingRoute"
                        @click="() => go(onboardingRouteIndex)">
                        <PageControlItem />
                    </PageControlTrigger>
                    <PageControlTrigger
                        v-else
                        :value="onboardingRoute"
                        :disabled="true">
                        <PageControlItem />
                    </PageControlTrigger>
                </template>
            </PageControl>
        </div>
    </div>
</template>
