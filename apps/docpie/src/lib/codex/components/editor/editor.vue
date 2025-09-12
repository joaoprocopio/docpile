<script setup lang="ts">
import { tryOnScopeDispose } from "@vueuse/core"
import { baseKeymap } from "codex/commands"
import { history, redo, undo } from "codex/history"
import { keymap } from "codex/keymap"
import { schema } from "codex/schema-basic"
import { EditorState } from "codex/state"
import { EditorView } from "codex/view"
import { onMounted, useTemplateRef } from "vue"

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
    <div ref="editor" />
</template>

<style src="codex/view/style/prosemirror.css" />
