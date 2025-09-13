<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { ContextMenuItemEmits, ContextMenuItemProps } from "reka-ui"
import { ContextMenuItem, useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

const props = withDefaults(
    defineProps<
        ContextMenuItemProps & {
            class?: HTMLAttributes["class"]
            inset?: boolean
            variant?: "default" | "error"
        }
    >(),
    {
        variant: "default",
    },
)
const emits = defineEmits<ContextMenuItemEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
    <ContextMenuItem
        data-slot="context-menu-item"
        :data-inset="inset ? '' : undefined"
        :data-variant="variant"
        v-bind="forwarded"
        :class="
            cn(
                `focus:bg-accent focus:text-accent-foreground data-[variant=error]:text-error-foreground data-[variant=error]:focus:bg-error/10 dark:data-[variant=error]:focus:bg-error/40 data-[variant=error]:focus:text-error-foreground data-[variant=error]:*:[svg]:!text-error-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
                props.class,
            )
        ">
        <slot />
    </ContextMenuItem>
</template>
