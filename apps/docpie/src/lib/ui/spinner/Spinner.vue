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
                class="absolute inset-0 size-full overflow-hidden bg-primary text-muted" />
            <Icon
                name="lucide:loader"
                role="status"
                aria-label="Loading"
                class="reveal-spinner-clip-path absolute inset-0 size-full overflow-hidden bg-destructive text-foreground" />
        </div>
    </div>
</template>

<style>
.reveal-spinner-clip-path {
    clip-path: polygon(50% 50%, 70% 0%, 30% 0%, 50% 50%);
}
</style>
