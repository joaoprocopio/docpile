<script setup lang="ts">
import { Button } from "~/lib/ui/button"
import { Separator } from "~/lib/ui/separator"
import { SidebarTrigger, useSidebar } from "~/lib/ui/sidebar"
import { Triangle } from "~/lib/ui/triangle"

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

        <div class="px-6">
            <div
                class="flex px-1 py-1 items-center rounded-md gap-1.5 bg-gray-a3 [&>button:has-[svg]]:size-7 [&>button>svg]:size-4!">
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

                <Button
                    variant="ghost"
                    size="xs">
                    <span class="text-foreground"> Normal text </span>
                    <Triangle />
                </Button>

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

                <Button
                    class="ml-auto"
                    variant="ghost"
                    size="xs">
                    <Icon name="lucide:square-pen" />
                    <span class="text-foreground"> Edit mode </span>
                    <Triangle />
                </Button>
            </div>
        </div>

        <!-- <Editor /> -->
    </div>
</template>
