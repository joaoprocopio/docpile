<script setup lang="ts">
// import { Editor } from "~/lib/prosemirror/components/editor"
import { Button } from "~/lib/ui/button"
import { SidebarTrigger, useSidebar } from "~/lib/ui/sidebar"

const sidebar = useSidebar()
</script>

<template>
    <div>
        <div class="flex items-center text-sm gap-2 h-12 px-6">
            <SidebarTrigger v-if="!sidebar.open.value" />

            <!-- TODO: trocar pro titulo vindo da api -->
            <h1 class="font-semibold truncate">Scoped API Keys</h1>

            <Button
                variant="ghost"
                size="xs"
                class="text-accent-foreground">
                File
            </Button>
            <Button
                variant="ghost"
                size="xs"
                class="text-accent-foreground">
                Edit
            </Button>
            <Button
                variant="ghost"
                size="xs"
                class="text-accent-foreground">
                Insert
            </Button>

            <p class="ml-auto text-muted-foreground text-xs truncate">Edited 42min ago</p>
            <Button
                size="xs"
                variant="secondary">
                Share
            </Button>
        </div>

        <div class="flex items-center gap-4 h-12 px-6 bg-gray-a3"></div>
        <!-- <Editor /> -->
    </div>
</template>
