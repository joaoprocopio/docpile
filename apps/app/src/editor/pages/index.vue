<script setup lang="ts">
import "@docpie/codex/view/style/prosemirror.css";

import { schema } from "@docpie/codex/schema-basic";
import { EditorState } from "@docpie/codex/state";
import { EditorView } from "@docpie/codex/view";
import { onMounted, useTemplateRef } from "vue";

const ref = useTemplateRef("editor");

onMounted(() => {
  const state = EditorState.create({ schema: schema });
  const view = new EditorView(ref.value, { state: state });
});
</script>

<template>
  <div ref="editor"></div>
</template>
