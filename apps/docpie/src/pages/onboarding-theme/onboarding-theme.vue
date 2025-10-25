<script setup lang="ts">
import type { AcceptableValue } from "reka-ui"

import { useColorMode } from "#imports"
import { ColorMode } from "~/ext/color-mode/constants"
import { ToggleGroup, ToggleGroupItem } from "~/lib/ui/toggle-group"
import { isString } from "~/utils/is"

const colorMode = useColorMode()

function update(cm: AcceptableValue | AcceptableValue[]) {
    if (!isString(cm)) {
        return void undefined
    }

    if (cm === colorMode.preference) {
        return void undefined
    }

    colorMode.preference = cm
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

        <div>
            <ToggleGroup
                type="single"
                :model-value="colorMode.preference"
                :default-value="colorMode.preference"
                @update:model-value="update">
                <ToggleGroupItem :value="ColorMode.System">System</ToggleGroupItem>
                <ToggleGroupItem :value="ColorMode.Dark">Dark</ToggleGroupItem>
                <ToggleGroupItem :value="ColorMode.Light">Light</ToggleGroupItem>
            </ToggleGroup>
        </div>
    </div>
</template>
