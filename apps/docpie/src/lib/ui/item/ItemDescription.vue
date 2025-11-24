<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <p
        data-slot="item-description"
        :class="
            cn(
                'leading-normal line-clamp-2 text-xs font-normal text-balance text-muted-foreground',
                '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
                props.class,
            )
        ">
        <slot />
    </p>
</template>
