<script setup lang="ts">
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from "./utils"
import type { HTMLAttributes } from "vue"
import { cn } from "~/lib/ui/utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <div
        data-slot="sidebar-wrapper"
        :style="{
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
        }"
        :class="
            cn(
                'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
                props.class,
            )
        "
        v-bind="$attrs">
        <slot />
    </div>
</template>
