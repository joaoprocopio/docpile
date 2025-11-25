<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <CacheDevtools />
    <Sonner />
</template>

<script setup lang="ts">
import { CacheDevtools } from "~/lib/cache/runtime/components/devtools"
import { Sonner } from "~/lib/ui/sonner"
</script>
