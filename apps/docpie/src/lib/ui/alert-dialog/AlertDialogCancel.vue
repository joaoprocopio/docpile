<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { AlertDialogCancelProps } from "reka-ui"
import { AlertDialogCancel } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { type ButtonVariants, buttonVariants } from "~/lib/ui/button"
import { cn } from "~/lib/ui/utils"

interface Props extends AlertDialogCancelProps {
    class?: HTMLAttributes["class"]
    variant?: ButtonVariants["variant"]
    size?: ButtonVariants["size"]
}

const props = withDefaults(defineProps<Props>(), {
    variant: "ghost",
    class: undefined,
    size: undefined,
})

const delegatedProps = reactiveOmit(props, ["class", "variant", "size"])
</script>

<template>
    <AlertDialogCancel
        v-bind="delegatedProps"
        :class="
            cn(
                buttonVariants({ size: props.size, variant: props.variant }),
                'mt-2 sm:mt-0',
                props.class,
            )
        ">
        <slot />
    </AlertDialogCancel>
</template>
