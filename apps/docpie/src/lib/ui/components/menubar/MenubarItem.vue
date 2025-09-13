<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { MenubarItemEmits, MenubarItemProps } from "reka-ui"
import { MenubarItem, useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

const props = defineProps<
    MenubarItemProps & {
        class?: HTMLAttributes["class"]
        inset?: boolean
        variant?: "default" | "error"
    }
>()

const emits = defineEmits<MenubarItemEmits>()

const delegatedProps = reactiveOmit(props, "class", "inset", "variant")
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
    <MenubarItem
        data-slot="menubar-item"
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
    </MenubarItem>
</template>
