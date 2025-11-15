<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import type { HTMLAttributes } from "vue"
import { computed, provide, ref, toRef } from "vue"

import { cn } from "~/lib/ui/utils"

import { pageControlInjectionKey, type PageControlValue } from "./context"

const props = withDefaults(
    defineProps<{
        class?: HTMLAttributes["class"]
        defaultValue?: PageControlValue
        modelValue?: PageControlValue
        disabled?: boolean
        loop?: boolean
        orientation?: "horizontal" | "vertical"
    }>(),
    {
        disabled: false,
        loop: false,
        orientation: "horizontal",
    },
)

const emits = defineEmits<{
    (e: "update:modelValue", payload?: PageControlValue): void
    (e: "change", payload?: PageControlValue): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
    defaultValue: props.defaultValue,
})

const rootRef = ref<HTMLElement | null>(null)

function select(value: PageControlValue) {
    if (props.disabled) {
        return
    }

    if (modelValue.value === value) {
        emits("change", value)
        return
    }

    modelValue.value = value
    emits("change", value)
}

provide(pageControlInjectionKey, {
    rootRef,
    value: modelValue,
    disabled: toRef(props, "disabled"),
    loop: toRef(props, "loop"),
    orientation: toRef(props, "orientation"),
    select,
})

const ariaOrientation = computed(() =>
    props.orientation === "vertical" ? "vertical" : "horizontal",
)
</script>

<template>
    <div
        ref="rootRef"
        role="tablist"
        aria-label="page control"
        data-slot="page-control"
        :data-disabled="props.disabled ? '' : undefined"
        :data-orientation="props.orientation"
        :aria-disabled="props.disabled || undefined"
        :aria-orientation="ariaOrientation"
        :class="cn('flex items-center', props.class)">
        <slot />
    </div>
</template>
