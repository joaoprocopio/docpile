<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <span
        data-slot="menubar-shortcut"
        :class="cn('tracking-widest ml-auto text-xs text-muted-foreground', props.class)">
        <slot />
    </span>
</template>
