<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "~/lib/ui/utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <div
        data-slot="item-title"
        :class="cn('leading-snug flex w-fit items-center gap-2 text-xs font-medium', props.class)">
        <slot />
    </div>
</template>
