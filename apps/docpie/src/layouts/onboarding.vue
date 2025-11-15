<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

import { UserMenu } from "~/components/user-menu"
import { asConst } from "~/lib/const"
import { OrgRoutes } from "~/lib/router/constants"

const router = useRouter()
const route = useRoute()

const ONBOARDING_ROUTES = asConst([
    OrgRoutes.Onboarding.Intro,
    OrgRoutes.Onboarding.Theme,
    OrgRoutes.Onboarding.Team,
])

const onboardingRouteIndex = computed(() =>
    ONBOARDING_ROUTES.findIndex((onboardingRoute) => onboardingRoute === route.name),
)
</script>

<template>
    <div class="grid h-full grid-cols-1 grid-rows-[auto_1fr_auto] bg-gradient-auth">
        <div class="mx-auto px-6 py-4 sm:ml-auto">
            <UserMenu />
        </div>

        <div class="mx-auto w-full max-w-md px-6 py-10">
            <slot />
        </div>
    </div>
</template>
