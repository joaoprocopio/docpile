<script setup lang="ts">
import { tryOnScopeDispose } from "@vueuse/core"
import { baseKeymap } from "prosemirror-commands"
import { history, redo, undo } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { schema } from "prosemirror-schema-basic"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { onMounted, useTemplateRef } from "vue"
import { Button } from "~/lib/ui/button"
import { Separator } from "~/lib/ui/separator"
import { SidebarTrigger, useSidebar } from "~/lib/ui/sidebar"
import { Triangle } from "~/lib/ui/triangle"

const sidebar = useSidebar()
const editorRef = useTemplateRef("editor")

let editorState: EditorState | undefined = undefined
let editorView: EditorView | undefined = undefined

onMounted(() => {
    editorState = EditorState.create({
        schema: schema,
        plugins: [
            history(),
            keymap({
                "Mod-z": undo,
                "Mod-y": redo,
            }),
            keymap(baseKeymap),
        ],
    })

    editorView = new EditorView(editorRef.value, {
        state: editorState,
    })
})

tryOnScopeDispose(() => {
    if (editorView) {
        editorView.destroy()
    }
})
</script>

<template>
    <div class="px-6">
        <div class="flex px-2 items-center text-sm gap-2 py-2">
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
            class="flex bg-gray-a3 rounded-md px-2 py-1.5 items-center gap-2 [&>button:has(svg:only-child)]:size-7 [&>button>svg]:size-4!">
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
                class="data-[orientation=vertical]:h-4 mx-1"
                orientation="vertical" />

            <Button
                variant="ghost"
                size="xs">
                <span class="text-foreground"> Normal text </span>
                <Triangle />
            </Button>

            <Separator
                class="data-[orientation=vertical]:h-4 mx-1"
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
                class="data-[orientation=vertical]:h-4 mx-1"
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

        <div class="py-6">
            <div
                ref="editor"
                class="max-w-xl mx-auto" />
        </div>
    </div>
</template>

<style src="prosemirror-view/style/prosemirror.css" />
