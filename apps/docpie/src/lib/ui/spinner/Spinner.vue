<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <div>
        <div :class="cn('relative size-4.5 overflow-hidden', props.class)">
            <Icon
                name="lucide:loader"
                role="status"
                aria-label="Loading"
                class="absolute inset-0 size-full overflow-hidden text-gray-a8" />
            <Icon
                name="lucide:loader"
                role="status"
                aria-label="Loading"
                class="indicator absolute inset-0 size-full overflow-hidden text-foreground" />
        </div>
    </div>
</template>

<style>
.indicator {
    clip-path: polygon(50% 50%, 70% 0%, 30% 0%, 50% 50%);
    animation: reveal-indicator 875ms steps(8) infinite;
}

@keyframes reveal-indicator {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
