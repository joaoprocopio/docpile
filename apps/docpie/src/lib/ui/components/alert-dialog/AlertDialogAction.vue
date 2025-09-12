<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { AlertDialogActionProps } from "reka-ui"
import { AlertDialogAction } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"
import { buttonVariants } from "~/lib/ui/components/button"

const props = defineProps<AlertDialogActionProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
    <AlertDialogAction
        v-bind="delegatedProps"
        :class="cn(buttonVariants(), props.class)">
        <slot />
    </AlertDialogAction>
</template>
