<script setup lang="ts">
import { useMediaQuery, useStorage } from "@vueuse/core"
import { computed, type ModelRef } from "vue"

import { cookieStorage } from "~/lib/vueuse/cookie-storage"

import { provideSidebarContext, SIDEBAR_COOKIE_MAX_AGE, SIDEBAR_COOKIE_NAME } from "./utils"

const props = withDefaults(
    defineProps<{
        defaultOpen?: boolean
    }>(),
    {
        defaultOpen: true,
        open: undefined,
    },
)

const isMobile = useMediaQuery("(max-width: 768px)")

const __INTERNAL_COOKIE_OPEN__ = useStorage(
    SIDEBAR_COOKIE_NAME,
    props.defaultOpen,
    cookieStorage({ expires: SIDEBAR_COOKIE_MAX_AGE }),
)

const open = defineModel<boolean>("open", {
    get() {
        return __INTERNAL_COOKIE_OPEN__.value
    },
    set(value) {
        __INTERNAL_COOKIE_OPEN__.value = value
    },
}) as ModelRef<boolean, string, boolean, boolean>

// Helper to toggle the sidebar.
function toggleSidebar() {
    open.value = !open.value
}

// We add a state so that we can do data-state="expanded" or "collapsed".
// This makes it easier to style the sidebar with Tailwind classes.
const state = computed(() => (open.value ? "expanded" : "collapsed"))

provideSidebarContext({
    state,
    open,
    isMobile,
    toggleSidebar,
})
</script>

<template>
    <slot />
</template>
