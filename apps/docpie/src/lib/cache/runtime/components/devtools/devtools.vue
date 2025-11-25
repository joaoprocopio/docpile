<template>
    <Teleport to="body">
        <VueQueryDevtools v-bind="$attrs" />
    </Teleport>
</template>

<script lang="ts" setup>
import { VueQueryDevtools } from "@tanstack/vue-query-devtools"

defineOptions({
    inheritAttrs: true,
})
</script>
