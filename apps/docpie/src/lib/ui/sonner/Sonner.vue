<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { Toaster as Sonner } from "vue-sonner"

import { computed, useColorMode } from "#imports"

const props = defineProps<ToasterProps>()
const colorMode = useColorMode()
const theme = computed(() => colorMode.value as ToasterProps["theme"])
</script>

<template>
    <Sonner
        class="toaster group font-sans!"
        v-bind="props"
        :toast-options="{
            closeButton: true,
            duration: 3_000,
            classes: {
                title: 'text-xs',
                description: 'text-2xs',
            },
            style: {
                '--normal-bg': 'var(--popover)',
                '--normal-text': 'var(--popover-foreground)',
                '--normal-border': 'var(--border)',
            },
        }"
        :theme="theme" />
</template>
