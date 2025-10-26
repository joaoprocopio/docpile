<script setup lang="ts">
import type { AcceptableValue } from "reka-ui"

import { useColorMode } from "#imports"
import { ColorMode, type TColorMode } from "~/ext/color-mode/constants"
import { OnboardingRoutes } from "~/lib/router/constants"
import { buttonVariants } from "~/lib/ui/button"
import { ToggleGroup, ToggleGroupItem } from "~/lib/ui/toggle-group"
import { isString } from "~/utils/is"

const colorMode = useColorMode()

function update(cm: AcceptableValue) {
    if (!isString(cm)) {
        return void undefined
    }

    if (cm === colorMode.preference) {
        return void undefined
    }

    colorMode.preference = cm
}

function resolveIcon(cm: TColorMode) {
    switch (cm) {
        case ColorMode.Light:
            return "lucide:sun"
        case ColorMode.Dark:
            return "lucide:moon"
        case ColorMode.System:
            return "lucide:monitor-speaker"
    }
}
</script>

<template>
    <div>
        <div class="space-y-1.5 text-center">
            <h1 class="text-2xl font-semibold">Choose you style</h1>
            <h2 class="text-xs text-muted-foreground">
                Change your theme at any time via settings.
            </h2>
        </div>

        <div class="mt-8">
            <ToggleGroup
                type="single"
                variant="outline"
                class="w-full"
                :model-value="colorMode.preference"
                :default-value="colorMode.preference"
                @update:model-value="update">
                <ToggleGroupItem
                    v-for="(cmVal, cmKey) in ColorMode"
                    :key="cmKey"
                    :value="cmVal"
                    class="h-fit gap-2.5 py-3">
                    <Icon
                        class="size-5 text-muted-foreground"
                        :name="resolveIcon(cmVal)" />

                    <p>{{ cmKey }}</p>
                </ToggleGroupItem>
            </ToggleGroup>
        </div>

        <div class="mx-auto max-w-48">
            <RouterLink
                :class="
                    buttonVariants({
                        class: 'mt-12 w-full',
                        variant: 'secondary',
                    })
                "
                :to="{ name: OnboardingRoutes.Org }">
                Continue
            </RouterLink>
        </div>
    </div>
</template>
