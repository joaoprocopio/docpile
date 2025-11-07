<script setup lang="ts">
import type { AcceptableValue } from "reka-ui"

import { useColorMode } from "#imports"
import { ColorMode, type TColorMode } from "~/ext/color-mode/constants"
import { OrgRoutes } from "~/lib/router/constants"
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
            <h1 class="text-2xl font-semibold">Choose your theme</h1>
            <h2 class="text-xs text-muted-foreground">
                Change your theme at any time via settings.
            </h2>
        </div>

        <div class="mt-8">
            <ToggleGroup
                type="single"
                variant="outline"
                class="min-w-full"
                :model-value="colorMode.value"
                :default-value="colorMode.value"
                @update:model-value="update">
                <template
                    v-for="(cmVal, cmKey) in ColorMode"
                    :key="cmKey">
                    <ToggleGroupItem
                        v-if="cmVal !== 'system'"
                        :value="cmVal"
                        class="h-fit gap-2.5 py-3">
                        <Icon
                            class="size-5 text-muted-foreground"
                            :name="resolveIcon(cmVal)" />

                        <p>{{ cmKey }}</p>
                    </ToggleGroupItem>
                </template>
            </ToggleGroup>
        </div>

        <div class="mt-12 flex flex-col items-center">
            <RouterLink
                :class="
                    buttonVariants({
                        class: 'min-w-40',
                        variant: 'secondary',
                    })
                "
                :to="{ name: OrgRoutes.Onboarding.Team }">
                Continue
            </RouterLink>
        </div>
    </div>
</template>
