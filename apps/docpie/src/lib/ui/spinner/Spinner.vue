<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { Icon } from "#components"
import { cn } from "~/lib/ui/utils"
import { array } from "~/utils/arr"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()

const iconBaseClass = "absolute inset-0 size-full overflow-hidden"

type IconProps = InstanceType<typeof Icon>["$props"]
const blades: IconProps[] = array(8).map(() => ({
    "name": "lucide:loader",
    "role": "status",
    "class": "absolute inset-0 size-full overflow-hidden",
    "aria-label": "Loading",
}))
</script>

<template>
    <div>
        <div :class="cn('relative size-4.5 overflow-hidden', props.class)">
            <Icon
                name="lucide:loader"
                role="status"
                aria-label="Loading"
                :class="[iconBaseClass, 'blade rotate-0 transform text-foreground']" />
            <Icon
                name="lucide:loader"
                role="status"
                aria-label="Loading"
                :class="[iconBaseClass, 'text-gray-a8']" />
        </div>
    </div>
</template>

<style>
.blade {
    clip-path: polygon(50% 50%, 70% 0%, 30% 0%, 50% 50%);
    /* animation: reveal-indicator 875ms steps(8) infinite; */
}

/* @keyframes reveal-indicator {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
} */
</style>
