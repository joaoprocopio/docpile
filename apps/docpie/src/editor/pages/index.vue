<script setup lang="ts">
import "@docpie/codex/view/style/prosemirror.css";

import { schema } from "@docpie/codex/schema-basic";
import { EditorState } from "@docpie/codex/state";
import { EditorView } from "@docpie/codex/view";
import { onMounted, useTemplateRef } from "vue";

const ref = useTemplateRef("editor");

onMounted(() => {
  const view = new EditorView(ref.value, {
    state: EditorState.create({ schema: schema }),
    dispatchTransaction(tr) {
      console.log(
        "Document size went from",
        tr.before.content.size,
        "to",
        tr.doc.content.size,
      );

      const newState = view.state.apply(tr);
      view.updateState(newState);
    },
  });
});
</script>

<template>
  <div>
    <h1 class="font-bold">editor</h1>
    <div ref="editor"></div>
  </div>
</template>
