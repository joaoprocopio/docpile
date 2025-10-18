<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <Icon
        name="lucide:loader"
        role="status"
        aria-label="Loading"
        :class="cn('size-4 animate-spin', props.class)" />
</template>
