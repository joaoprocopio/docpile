<script lang="ts" setup>
import { reactiveOmit } from "@vueuse/core"
import type { DrawerTitleProps } from "vaul-vue"
import { DrawerTitle } from "vaul-vue"
import type { HTMLAttributes } from "vue"

import { cn } from "~/utils"

const props = defineProps<DrawerTitleProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
    <DrawerTitle
        data-slot="drawer-title"
        v-bind="delegatedProps"
        :class="cn('font-semibold text-foreground', props.class)">
        <slot />
    </DrawerTitle>
</template>
