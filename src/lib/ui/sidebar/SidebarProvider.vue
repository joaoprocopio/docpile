<script lang="ts">
import { provideSidebarContext, SIDEBAR_COOKIE_MAX_AGE, SIDEBAR_COOKIE_NAME } from "./utils"
import { syncRef, useMediaQuery, useStorage } from "@vueuse/core"
import type { HTMLAttributes } from "vue"
import { computed } from "vue"
import { createCookieStorage } from "~/lib/vueuse/cookie-storage"

const cookieStorage = createCookieStorage({ expires: SIDEBAR_COOKIE_MAX_AGE })
const initialOpen = cookieStorage.getItem(SIDEBAR_COOKIE_NAME) === "true"
</script>

<script setup lang="ts">
withDefaults(
    defineProps<{
        defaultOpen?: boolean
        class?: HTMLAttributes["class"]
    }>(),
    {
        defaultOpen: initialOpen,
        class: undefined,
    },
)

const isMobile = useMediaQuery("(max-width: 768px)")
const state = computed(() => (open.value ? "expanded" : "collapsed"))
const cookie = useStorage<boolean>(SIDEBAR_COOKIE_NAME, initialOpen, cookieStorage)
const open = defineModel<boolean>("open", { default: initialOpen })

syncRef(open, cookie, { transform: { rtl: (v) => Boolean(v), ltr: (v) => Boolean(v) } })

function toggleSidebar() {
    open.value = !open.value
}

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
