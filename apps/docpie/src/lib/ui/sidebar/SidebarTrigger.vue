<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { Button } from "~/lib/ui/button"
import { cn } from "~/lib/ui/utils"

import { useSidebar } from "./utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
    <Button
        data-sidebar="trigger"
        data-slot="sidebar-trigger"
        variant="ghost"
        size="icon"
        :class="cn('size-7 text-muted-foreground', props.class)"
        @click="toggleSidebar">
        <Icon name="lucide:panel-left" />
        <span class="sr-only">Toggle Sidebar</span>
    </Button>
</template>
