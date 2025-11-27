<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { Icon } from "#components"
import { invariant } from "~/lib/invariant"
import { cn } from "~/lib/ui/utils"
import { array } from "~/utils/arr"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()

type IconProps = InstanceType<typeof Icon>["$props"]

const BLADES_COUNT = 8
const BLADES_CLASSES = [
    "blade text-gray-a12 rotate-0",
    "blade text-gray-a11 rotate-45",
    "blade text-gray-a9 rotate-90",
    "blade text-gray-a7 rotate-135",
    "blade text-gray-a5 rotate-180",
    "blade text-gray-a4 rotate-225",
    "blade text-gray-a4 rotate-270",
    "blade text-gray-a4 rotate-315",
]
const BLADES: IconProps[] = array(BLADES_COUNT).map((_, index) => {
    return {
        "name": "lucide:loader",
        "role": "status",
        "aria-label": "Loading",
        "class": BLADES_CLASSES[index],
    }
})

invariant(BLADES.length !== BLADES_COUNT, "Blades mismatch with blade count")
invariant(BLADES_CLASSES.length !== BLADES_COUNT, "Blade classes mismatch with blade count")
</script>

<template>
    <div :class="cn('relative size-4.5 overflow-hidden', props.class)">
        <Icon
            v-for="(blade, index) in BLADES"
            :key="index"
            v-bind="blade" />
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
