<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

import { UserMenu } from "~/components/user-menu"
import { asConst } from "~/lib/const"
import { OrgRoutes } from "~/lib/router/constants"
import { Button } from "~/lib/ui/button"
import { PageControl, PageControlItem, PageControlTrigger } from "~/lib/ui/page-control"

const router = useRouter()
const route = useRoute()

const ONBOARDING_STEPS = asConst([
    {
        route: OrgRoutes.Onboarding.Intro,
        title: "Welcome",
    },
    {
        route: OrgRoutes.Onboarding.Theme,
        title: "Choose your theme",
    },
    {
        route: OrgRoutes.Onboarding.Team,
        title: "Invite your team",
    },
])

const onboardingRouteIndex = computed(() =>
    ONBOARDING_STEPS.findIndex((step) => step.route === route.name),
)
const onboardingStepCount = ONBOARDING_STEPS.length
const currentStep = computed(() =>
    onboardingRouteIndex.value === -1 ? undefined : ONBOARDING_STEPS[onboardingRouteIndex.value],
)
const previousRoute = computed(() =>
    onboardingRouteIndex.value > 0
        ? ONBOARDING_STEPS[onboardingRouteIndex.value - 1].route
        : undefined,
)
const nextRoute = computed(() =>
    onboardingRouteIndex.value !== -1 && onboardingRouteIndex.value < onboardingStepCount - 1
        ? ONBOARDING_STEPS[onboardingRouteIndex.value + 1].route
        : undefined,
)
const indicatorLabel = computed(() => {
    if (onboardingRouteIndex.value === -1) {
        return ""
    }

    return `Step ${onboardingRouteIndex.value + 1} of ${onboardingStepCount}`
})
const indicatorTitle = computed(() => currentStep.value?.title ?? "Onboarding")
const activeRouteName = computed(() => (typeof route.name === "string" ? route.name : undefined))

function navigateTo(routeName?: string | number) {
    if (!routeName || typeof routeName !== "string") {
        return
    }

    router.push({ name: routeName })
}
</script>

<template>
    <div class="grid h-full grid-cols-1 grid-rows-[auto_1fr_auto] bg-gradient-auth">
        <div class="mx-auto px-6 py-4 sm:ml-auto">
            <UserMenu />
        </div>

        <div class="mx-auto w-full max-w-md px-6 py-10">
            <slot />
        </div>

        <div
            v-if="onboardingRouteIndex !== -1"
            class="mx-auto w-full max-w-md px-6 pb-10">
            <PageControl
                class="mt-5 justify-center"
                orientation="horizontal"
                :model-value="activeRouteName"
                loop
                @update:model-value="navigateTo">
                <PageControlTrigger
                    v-for="(step, stepIndex) in ONBOARDING_STEPS"
                    :key="step.route"
                    :value="step.route"
                    :disabled="stepIndex > onboardingRouteIndex">
                    <PageControlItem />
                </PageControlTrigger>
            </PageControl>
        </div>
    </div>
</template>
