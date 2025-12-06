<template>
    <ColorScheme>
        <ConfigProvider>
            <TooltipProvider :delay-duration="0">
                <SidebarProvider>
                    <NuxtLayout>
                        <NuxtPage />
                    </NuxtLayout>

                    <CacheDevtools />
                    <Sonner />
                </SidebarProvider>
            </TooltipProvider>
        </ConfigProvider>
    </ColorScheme>
</template>

<script setup lang="ts">
import { ConfigProvider } from "reka-ui"
import { CacheDevtools } from "~/lib/cache/runtime/components/devtools"
import { SidebarProvider } from "~/lib/ui/sidebar"
import { Sonner } from "~/lib/ui/sonner"
import { TooltipProvider } from "~/lib/ui/tooltip"
</script>
