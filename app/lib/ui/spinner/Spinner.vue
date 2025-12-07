<script setup lang="ts">
import { Icon } from "#components"
import { array } from "#shared/utils/arr"
import { invariant } from "#shared/utils/invariant"
import type { HTMLAttributes } from "vue"
import { cn } from "~/lib/ui/utils"

const props = defineProps<{
    class?: HTMLAttributes["class"]
}>()

type IconProps = InstanceType<typeof Icon>["$props"]

const BLADES_COUNT = 8
const BLADES_CLASSES = [
    "blade text-gray-a10 rotate-0",
    "blade text-gray-a9 rotate-45",
    "blade text-gray-a7 rotate-90",
    "blade text-gray-a6 rotate-135",
    "blade text-gray-a4 rotate-180",
    "blade text-gray-a3 rotate-225",
    "blade text-gray-a3 rotate-270",
    "blade text-gray-a3 rotate-315",
]

invariant(BLADES_CLASSES.length === BLADES_COUNT, "Blade classes length mismatch with blade count")

const BLADES: IconProps[] = array(BLADES_COUNT).map((_, index) => {
    return {
        "name": "lucide:loader",
        "role": "status",
        "aria-label": "Loading",
        "class": BLADES_CLASSES[index],
    }
})

invariant(BLADES.length === BLADES_COUNT, "Blades array length mismatch with blade count")
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
