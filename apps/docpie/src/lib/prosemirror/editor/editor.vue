<script setup lang="ts">
import { tryOnScopeDispose } from "@vueuse/core"
import { baseKeymap } from "prosemirror-commands"
import { history, redo, undo } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { schema } from "prosemirror-schema-basic"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
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

<style src="prosemirror-view/style/prosemirror.css" />
