<script lang="ts" setup>
import { reactiveOmit } from "@vueuse/core"
import type { RangeCalendarCellTriggerProps } from "reka-ui"
import { RangeCalendarCellTrigger, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { buttonVariants } from "~/lib/ui/components/button"
import { cn } from "~/lib/ui/utils"

const props = withDefaults(
    defineProps<RangeCalendarCellTriggerProps & { class?: HTMLAttributes["class"] }>(),
    {
        as: "button",
    },
)

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
    <RangeCalendarCellTrigger
        data-slot="range-calendar-trigger"
        :class="
            cn(
                buttonVariants({ variant: 'ghost' }),
                'h-8 w-8 p-0 font-normal data-[selected]:opacity-100',
                '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground',
                // Selection Start
                'data-[selection-start]:bg-accent data-[selection-start]:text-accent-foreground data-[selection-start]:hover:bg-accent data-[selection-start]:hover:text-accent-foreground data-[selection-start]:focus:bg-accent data-[selection-start]:focus:text-accent-foreground',
                // Selection End
                'data-[selection-end]:bg-accent data-[selection-end]:text-accent-foreground data-[selection-end]:hover:bg-accent data-[selection-end]:hover:text-accent-foreground data-[selection-end]:focus:bg-accent data-[selection-end]:focus:text-accent-foreground',
                // Outside months
                'data-[outside-view]:text-muted-foreground',
                // Disabled
                'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
                // Unavailable
                'data-[unavailable]:text-error-foreground data-[unavailable]:line-through',
                props.class,
            )
        "
        v-bind="forwardedProps">
        <slot />
    </RangeCalendarCellTrigger>
</template>
