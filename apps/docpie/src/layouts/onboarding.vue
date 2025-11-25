<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

import { UserMenu } from "~/components/user-menu"
import { asConst } from "~/lib/const"
import { OrgRoutes } from "~/lib/router/constants"
import { PageControl, PageControlItem, PageControlTrigger } from "~/lib/ui/page-control"

const route = useRoute()

const ONBOARDING_STEPS = asConst([
    OrgRoutes.Onboarding.Intro,
    OrgRoutes.Onboarding.Theme,
    OrgRoutes.Onboarding.Team,
])

const currentOnboardingRouteIndex = computed<number>(() =>
    ONBOARDING_STEPS.findIndex((onboardingRoute) => onboardingRoute === route.name),
)

const isStepping = computed<boolean>(() => currentOnboardingRouteIndex.value !== -1)
</script>

<template>
    <div
        class="grid h-full grid-cols-1 grid-rows-[auto_1fr_auto]"
        style="--topbar-height: 4rem; --bottombar-height: 3rem">
        <div
            class="fixed inset-x-0 top-0 z-10 flex h-(--topbar-height) w-full items-center justify-center sm:justify-end">
            <div class="overflow-hidden rounded-full bg-background/40 backdrop-blur">
                <UserMenu />
            </div>
        </div>

        <div
            :data-is-stepping="isStepping ? '' : undefined"
            class="pt-(--topbar-height) data-is-stepping:pb-(--bottombar-height)">
            <div class="mx-auto max-w-md px-6 py-10">
                <slot />
            </div>
        </div>

        <div
            v-if="isStepping"
            class="fixed inset-x-0 bottom-0 z-10 flex h-(--bottombar-height) items-center justify-center">
            <PageControl
                class="rounded-full bg-background/40 px-2 py-1 backdrop-blur"
                :model-value="(() => route.name as string)()">
                <template
                    v-for="(onboardingRoute, onboardingRouteIndex) in ONBOARDING_STEPS"
                    :key="onboardingRouteIndex">
                    <PageControlTrigger
                        v-if="onboardingRouteIndex <= currentOnboardingRouteIndex"
                        as-child
                        :value="onboardingRoute">
                        <NuxtLink :to="{ name: onboardingRoute }">
                            <PageControlItem />
                        </NuxtLink>
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
