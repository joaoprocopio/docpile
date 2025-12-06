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
                'block size-3 rounded-full transition-all duration-200 group-data-[state=active]:bg-gray-a7 group-data-[state=disabled]:bg-gray-a3 group-data-[state=reachable]:bg-gray-a5',
                props.class,
            )
        ">
        <slot />
    </span>
</template>
