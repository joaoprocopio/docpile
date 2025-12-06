<script setup lang="ts">
import { Button } from "~/lib/ui/button"
import { Separator } from "~/lib/ui/separator"
import { SidebarTrigger, useSidebar } from "~/lib/ui/sidebar"

const sidebar = useSidebar()
</script>

<template>
    <div>
        <div class="flex items-center text-sm gap-2 h-12 px-6">
            <SidebarTrigger
                v-if="!sidebar.open.value"
                size="sm" />

            <!-- TODO: trocar pro titulo vindo da api -->
            <h1 class="font-semibold truncate">Scoped API Keys</h1>

            <Button
                variant="ghost"
                size="xs">
                File
            </Button>
            <Button
                variant="ghost"
                size="xs">
                Edit
            </Button>
            <Button
                variant="ghost"
                size="xs">
                Insert
            </Button>

            <p class="ml-auto text-muted-foreground text-xs truncate">Edited 42min ago</p>
            <Button
                size="xs"
                variant="secondary">
                Share
            </Button>
        </div>

        <div
            class="flex items-center gap-2 h-10 px-6 bg-gray-a2 [&>button]:size-7 [&>button>svg]:size-4!">
            <Button
                variant="ghost"
                size="icon">
                <Icon name="lucide:undo-2" />
            </Button>
            <Button
                variant="ghost"
                size="icon">
                <Icon name="lucide:redo-2" />
            </Button>

            <Separator
                class="data-[orientation=vertical]:h-4"
                orientation="vertical" />

            <Separator
                class="data-[orientation=vertical]:h-4"
                orientation="vertical" />

            <Button
                variant="ghost"
                size="icon">
                <Icon name="lucide:bold" />
            </Button>
            <Button
                variant="ghost"
                size="icon">
                <Icon name="lucide:italic" />
            </Button>
            <Button
                variant="ghost"
                size="icon">
                <Icon name="lucide:underline" />
            </Button>
            <Button
                variant="ghost"
                size="icon">
                <Icon name="lucide:strikethrough" />
            </Button>

            <Separator
                class="data-[orientation=vertical]:h-4"
                orientation="vertical" />

            <Button
                variant="ghost"
                size="icon">
                <Icon name="lucide:link" />
            </Button>
            <Button
                variant="ghost"
                size="icon">
                <Icon name="lucide:external-link" />
            </Button>
            <Button
                variant="ghost"
                size="icon">
                <Icon name="lucide:image" />
            </Button>
        </div>
        <!-- <Editor /> -->
    </div>
</template>
