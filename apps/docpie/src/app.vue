<template>
    <ConfigProvider>
        <TooltipProvider>
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>

            <CacheDevtools />
            <Sonner />
        </TooltipProvider>
    </ConfigProvider>
</template>

<script setup lang="ts">
import { ConfigProvider } from "reka-ui"

import { CacheDevtools } from "~/lib/cache/runtime/components/devtools"
import { Sonner } from "~/lib/ui/sonner"
import { TooltipProvider } from "~/lib/ui/tooltip"
</script>
