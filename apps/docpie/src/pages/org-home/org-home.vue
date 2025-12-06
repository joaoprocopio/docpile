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
        plugins: [history(), keymap(baseKeymap)],
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
        <div class="flex items-center gap-2 px-2 py-2.5 text-sm">
            <SidebarTrigger
                v-if="!sidebar.open.value"
                size="sm" />

            <!-- TODO: trocar pro titulo vindo da api -->
            <h1 class="truncate font-semibold">Scoped API Keys</h1>

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

            <p class="ml-auto truncate text-xs text-muted-foreground">Edited 42min ago</p>
            <Button
                size="xs"
                variant="secondary">
                Share
            </Button>
        </div>

        <div
            class="flex items-center gap-2 rounded-md bg-gray-a3 px-2 py-1.5 [&>button:has(svg:only-child)]:size-7 [&>button>svg]:size-4!">
            <Button
                variant="ghost"
                size="icon"
                @click="() => undo(editorState!)">
                <Icon name="lucide:undo-2" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                @click="() => redo(editorState!)">
                <Icon name="lucide:redo-2" />
            </Button>

            <Separator
                class="mx-1 data-[orientation=vertical]:h-4"
                orientation="vertical" />

            <Button
                variant="ghost"
                size="xs">
                <span class="text-foreground"> Normal text </span>
                <Triangle />
            </Button>

            <Separator
                class="mx-1 data-[orientation=vertical]:h-4"
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
                class="mx-1 data-[orientation=vertical]:h-4"
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

        <div class="px-2 py-6">
            <div
                ref="editor"
                class="mx-auto min-h-96 max-w-xl" />
        </div>
    </div>
</template>

<style>
.ProseMirror {
    position: relative;
    outline: none;
}

.ProseMirror {
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror pre {
    white-space: pre-wrap;
}

.ProseMirror li {
    position: relative;
}

.ProseMirror-hideselection *::selection {
    background: transparent;
}
.ProseMirror-hideselection *::-moz-selection {
    background: transparent;
}
.ProseMirror-hideselection {
    caret-color: transparent;
}

/* See https://github.com/ProseMirror/prosemirror/issues/1421#issuecomment-1759320191 */
.ProseMirror [draggable][contenteditable="false"] {
    user-select: text;
}

.ProseMirror-selectednode {
    outline: 2px solid #8cf;
}

/* Make sure li selections wrap around markers */

li.ProseMirror-selectednode {
    outline: none;
}

li.ProseMirror-selectednode:after {
    content: "";
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
}

/* Protect against generic img rules */

img.ProseMirror-separator {
    display: inline !important;
    border: none !important;
    margin: 0 !important;
}
</style>
