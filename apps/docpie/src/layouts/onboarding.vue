<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

import { UserMenu } from "~/components/user-menu"
import { asConst } from "~/lib/const"
import { OrgRoutes } from "~/lib/router/constants"
import { PageControl, PageControlItem, PageControlTrigger } from "~/lib/ui/page-control"

const router = useRouter()
const route = useRoute()

const ONBOARDING_STEPS = asConst([
    OrgRoutes.Onboarding.Intro,
    OrgRoutes.Onboarding.Theme,
    OrgRoutes.Onboarding.Team,
])

const currentOnboardingRouteIndex = computed(() =>
    ONBOARDING_STEPS.findIndex((onboardingRoute) => onboardingRoute === route.name),
)

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
            v-if="currentOnboardingRouteIndex !== -1"
            class="mx-auto w-full max-w-md px-6 pb-10">
            <PageControl
                class="mt-5 justify-center"
                orientation="horizontal"
                :model-value="route.name as string"
                @update:model-value="navigateTo">
                <PageControlTrigger
                    v-for="(onboardingRoute, onboardingRouteIndex) in ONBOARDING_STEPS"
                    :key="onboardingRouteIndex"
                    :value="onboardingRoute"
                    :disabled="onboardingRouteIndex > currentOnboardingRouteIndex">
                    <PageControlItem />
                </PageControlTrigger>
            </PageControl>
        </div>
    </div>
</template>
