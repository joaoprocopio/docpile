<script setup lang="ts">
import { schema } from "codex/schema-basic";
import { EditorState } from "codex/state";
import { EditorView } from "codex/view";
import { onMounted, useTemplateRef } from "vue";

const ref = useTemplateRef("editor");

onMounted(() => {
  const view = new EditorView(ref.value, {
    state: EditorState.create({ schema: schema }),
    dispatchTransaction(tr) {
      const newState = view.state.apply(tr);
      view.updateState(newState);
    },
  });
});
</script>

<template>
  <div>
    <h1 class="font-bold">editor</h1>
    <div ref="editor" />
    <button>abc</button>
  </div>
</template>
