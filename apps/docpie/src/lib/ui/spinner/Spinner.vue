<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <div>
        <div :class="cn('relative size-4 overflow-hidden', props.class)">
            <Icon
                name="lucide:loader"
                role="status"
                aria-label="Loading"
                class="absolute inset-0 size-full overflow-hidden text-muted" />
            <Icon
                name="lucide:loader"
                role="status"
                aria-label="Loading"
                class="reveal-spinner-clip-path absolute inset-0 size-full overflow-hidden text-foreground" />
        </div>
    </div>
</template>

<style>
.reveal-spinner-clip-path {
    clip-path: inset(0 0 100% 0);
    animation: reveal-spinner-clip-path 1s cubic-bezier(0.77, 0, 0.175, 1) infinite;
}

@keyframes reveal-spinner-clip-path {
    from {
        clip-path: inset(0 0 0 0);
    }
    to {
        clip-path: inset(0 0 100% 0);
    }
}
</style>
