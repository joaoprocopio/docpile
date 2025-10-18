<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <QueryDevtools />
    <Sonner />
</template>

<script setup lang="ts">
import { QueryDevtools } from "~/lib/query/devtools"
import { Sonner } from "~/lib/ui/sonner"
</script>
