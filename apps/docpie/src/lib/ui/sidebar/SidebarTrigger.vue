<script setup lang="ts">
import { useSidebar } from "./utils"
import type { HTMLAttributes } from "vue"
import { Button } from "~/lib/ui/button"
import { cn } from "~/lib/ui/utils"

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
        :class="cn('size-8 text-muted-foreground [&>svg]:size-5!', props.class)"
        @click="toggleSidebar">
        <Icon name="lucide:panel-left" />
        <span class="sr-only">Toggle Sidebar</span>
    </Button>
</template>
