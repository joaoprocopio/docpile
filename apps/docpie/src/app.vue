<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <QueryDevtools />
    <Sonner />
</template>

<script setup lang="ts">
import { QueryDevtools } from "~/lib/cache/runtime/components/devtools"
import { Sonner } from "~/lib/ui/sonner"
</script>
