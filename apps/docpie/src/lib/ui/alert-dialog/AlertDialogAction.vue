<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { AlertDialogActionProps } from "reka-ui"
import { AlertDialogAction } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { type ButtonVariants, buttonVariants } from "~/lib/ui/button"
import { cn } from "~/lib/ui/utils"

interface Props extends AlertDialogActionProps {
    class?: HTMLAttributes["class"]
    variant?: ButtonVariants["variant"]
    size?: ButtonVariants["size"]
}

const props = withDefaults(defineProps<Props>(), {
    variant: "secondary",
    class: undefined,
    size: undefined,
})

const delegatedProps = reactiveOmit(props, ["class", "variant", "size"])
</script>

<template>
    <AlertDialogAction
        v-bind="delegatedProps"
        :class="cn(buttonVariants({ size: props.size, variant: props.variant }), props.class)">
        <slot />
    </AlertDialogAction>
</template>
