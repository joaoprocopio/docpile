<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>

    <Sonner />
    <VueQueryDevtools />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from "~/lib/query/devtools"
import { Sonner } from "~/lib/ui/sonner"
</script>
