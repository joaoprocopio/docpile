<template>
    <Teleport to="body">
        <Devtools v-bind="$attrs" />
    </Teleport>
</template>

<script lang="ts" setup>
import { VueQueryDevtools as Devtools } from "@tanstack/vue-query-devtools"

defineOptions({
    inheritAttrs: true,
})
</script>
