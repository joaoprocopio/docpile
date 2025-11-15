<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <span
        data-slot="page-control-item"
        :class="
            cn(
                'block size-2.5 rounded-full bg-border transition-all duration-200 group-data-disabled:bg-border/40 group-data-[state=active]:size-3 group-data-[state=active]:bg-primary dark:bg-border/60 dark:group-data-disabled:bg-border/30',
                props.class,
            )
        ">
        <slot />
    </span>
</template>
