<script setup lang="ts">
import { syncRef, useMediaQuery, useStorage } from "@vueuse/core"
import type { HTMLAttributes, ModelRef } from "vue"
import { computed } from "vue"

import { createCookieStorage, defaultCookieStorage } from "~/lib/vueuse/cookie-storage"

import { provideSidebarContext, SIDEBAR_COOKIE_MAX_AGE, SIDEBAR_COOKIE_NAME } from "./utils"

const props = withDefaults(
    defineProps<{
        defaultOpen?: boolean
        class?: HTMLAttributes["class"]
    }>(),
    {
        defaultOpen: !defaultCookieStorage.getItem(SIDEBAR_COOKIE_NAME),
        class: undefined,
    },
)

const isMobile = useMediaQuery("(max-width: 768px)")

const cookie = useStorage<boolean>(
    SIDEBAR_COOKIE_NAME,
    props.defaultOpen,
    createCookieStorage({ expires: SIDEBAR_COOKIE_MAX_AGE }),
)

const open = defineModel<boolean>("open") as ModelRef<boolean, string, boolean, boolean>

syncRef(open, cookie, { transform: { rtl: (v) => Boolean(v), ltr: (v) => Boolean(v) } })

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
