<template>
  <div ref="editor" />
</template>

<script setup lang="ts">
import { history, redo, undo } from "codex/history";
import { keymap } from "codex/keymap";
import { schema } from "codex/schema-basic";
import { EditorState } from "codex/state";
import { EditorView } from "codex/view";
import { onMounted, useTemplateRef } from "vue";

const ref = useTemplateRef("editor");

onMounted(() => {
  const state = EditorState.create({
    schema: schema,
    plugins: [
      history(),
      keymap({
        "Mod-z": undo,
        "Mod-y": redo,
      }),
    ],
  });
  const view = new EditorView(ref.value, {
    state: state,
    dispatchTransaction(tr) {
      const newState = view.state.apply(tr);
      view.updateState(newState);
    },
  });
});
</script>

<style src="codex/view/style/prosemirror.css" />
