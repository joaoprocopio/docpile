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
                'block size-3 rounded-full transition-all duration-200 group-data-[state=active]:bg-gray-a6 group-data-[state=disabled]:bg-gray-a2 group-data-[state=reachable]:bg-gray-a4',
                props.class,
            )
        ">
        <slot />
    </span>
</template>
