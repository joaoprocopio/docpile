<script setup lang="ts">
import doc from "./doc.md?raw"
import { tryOnScopeDispose } from "@vueuse/core"
import * as commands from "prosemirror-commands"
import * as dropcursor from "prosemirror-dropcursor"
import * as gapcursor from "prosemirror-gapcursor"
import * as history from "prosemirror-history"
import * as keymap from "prosemirror-keymap"
import * as markdown from "prosemirror-markdown"
import * as state from "prosemirror-state"
import * as view from "prosemirror-view"
import { onMounted, shallowRef, useTemplateRef } from "vue"
import { Button } from "~/lib/ui/button"
import { Separator } from "~/lib/ui/separator"
import { SidebarTrigger, useSidebar } from "~/lib/ui/sidebar"
import { Triangle } from "~/lib/ui/triangle"

const sidebar = useSidebar()
const editorRef = useTemplateRef("editor")

const editorState = shallowRef<state.EditorState | undefined>(undefined)
const editorView = shallowRef<view.EditorView | undefined>(undefined)

onMounted(() => {
    editorState.value = state.EditorState.create({
        schema: markdown.schema,
        doc: markdown.defaultMarkdownParser.parse(doc),
        plugins: [
            history.history(),
            keymap.keymap(commands.baseKeymap),
            dropcursor.dropCursor(),
            gapcursor.gapCursor(),
        ],
    })

    editorView.value = new view.EditorView(editorRef.value, {
        state: editorState.value,
    })
})

tryOnScopeDispose(() => {
    if (editorView.value) {
        editorView.value.destroy()
    }
})
</script>

<template>
    <div>
        <div class="sticky inset-x-0 top-0 z-10 overflow-hidden bg-background/60 backdrop-blur">
            <div class="flex h-10 items-center gap-2 border-b px-4 text-sm">
                <SidebarTrigger
                    v-if="!sidebar.open.value"
                    size="sm" />

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
                class="flex h-10 items-center gap-2 border-b px-4 [&>button:has(svg:only-child)]:size-7 [&>button>svg]:size-4!">
                <Button
                    variant="ghost"
                    size="icon"
                    @click="
                        () => history.undo(editorView!.state, editorView!.dispatch, editorView!)
                    ">
                    <Icon name="lucide:undo-2" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    @click="
                        () => history.redo(editorView!.state, editorView!.dispatch, editorView!)
                    ">
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
        </div>

        <div class="min-h-[1000px] px-6 py-6">
            <div
                ref="editor"
                class="mx-auto max-w-2xl px-4" />
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
