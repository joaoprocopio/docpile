<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "~/lib/ui/utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <div
        data-slot="alert-title"
        :class="
            cn('tracking-tight col-start-2 line-clamp-1 min-h-4 text-sm font-medium', props.class)
        ">
        <slot />
    </div>
</template>
