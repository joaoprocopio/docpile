<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()
</script>

<template>
    <div
        data-slot="alert-description"
        :class="
            cn(
                '[&_p]:leading-relaxed col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground',
                props.class,
            )
        ">
        <slot />
    </div>
</template>
