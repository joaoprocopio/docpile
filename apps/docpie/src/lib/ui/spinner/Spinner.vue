<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { Icon } from "#components"
import { cn } from "~/lib/ui/utils"
import { array } from "~/utils/arr"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()

type IconProps = InstanceType<typeof Icon>["$props"]

function resolveClass(index: number) {
    const classes: string[] = ["blade"]

    switch (index) {
        case 7:
            classes.push("text-gray-a12", "rotate-0")
            break
        case 6:
            classes.push("text-gray-a11", "rotate-45")
            break
        case 5:
            classes.push("text-gray-a9", "rotate-90")
            break
        case 4:
            classes.push("text-gray-a7", "rotate-135")
            break
        case 3:
            classes.push("text-gray-a5", "rotate-180")
            break
        case 2:
            classes.push("text-gray-a4", "rotate-225")
            break
        case 1:
            classes.push("text-gray-a4", "rotate-270")
            break
        case 0:
            classes.push("text-gray-a4", "rotate-315")
            break
        default:
            throw new Error(`Blade number ${index + 1} is invalid or unhandled.`)
    }

    return classes.join(" ")
}

const blades: IconProps[] = array(8).map((_, index) => ({
    "name": "lucide:loader",
    "role": "status",
    "aria-label": "Loading",
    "class": resolveClass(index),
}))
</script>

<template>
    <div>
        <div :class="cn('relative size-4.5 overflow-hidden', props.class)">
            <Icon
                v-for="(blade, index) in blades"
                :key="index"
                v-bind="blade" />
        </div>
    </div>
</template>

<style>
@reference "~/lib/tailwind/tailwind.css";

.blade {
    @apply absolute inset-0 size-full;
    clip-path: polygon(50% 50%, 70% 0%, 30% 0%, 50% 50%);
    animation: blade-cycle 950ms steps(8) infinite;
}

@keyframes blade-cycle {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
