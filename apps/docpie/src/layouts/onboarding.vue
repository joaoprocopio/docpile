<script setup lang="ts">
import { computed } from "vue"

import { useRoute } from "#app"
import { UserMenu } from "~/components/user-menu"
import { OnboardingRoutesArray, OnboardingRoutesSet } from "~/lib/router/constants"
import { PageControl, PageControlItem, PageControlTrigger } from "~/lib/ui/page-control"

const route = useRoute()
const isOnboarding = computed<boolean>(() => OnboardingRoutesSet.has(route.name as string))
</script>

<template>
    <div class="grid h-full grid-cols-1 grid-rows-[auto_1fr_auto] bg-gradient-auth">
        <div class="mx-auto px-6 py-4 sm:ml-auto">
            <UserMenu />
        </div>

        <div class="mx-auto max-w-md px-6 py-10">
            <slot />
        </div>

        <PageControl
            v-if="isOnboarding"
            class="mx-auto max-w-fit px-6 py-4"
            :total="OnboardingRoutesArray.length">
            <PageControlTrigger>
                <PageControlItem
                    v-for="name in OnboardingRoutesArray"
                    :key="name" />
            </PageControlTrigger>
        </PageControl>
    </div>
</template>
