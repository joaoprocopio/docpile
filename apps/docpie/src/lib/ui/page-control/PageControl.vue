<script setup lang="ts">
import { syncRef } from "@vueuse/core"
import type { HTMLAttributes } from "vue"
import { provide, ref, toRef, useTemplateRef, watch } from "vue"

import { cn } from "~/lib/ui/utils"

import { pageControlInjectionKey, type PageControlValue } from "./context"

const props = withDefaults(
    defineProps<{
        class?: HTMLAttributes["class"]
        defaultValue?: PageControlValue
        disabled?: boolean
        orientation?: "horizontal" | "vertical"
    }>(),
    {
        class: undefined,
        defaultValue: undefined,
        disabled: false,
        orientation: "horizontal",
    },
)

const _modelValue = defineModel<PageControlValue>("model-value")
const modelValue = ref(_modelValue.value ?? props.defaultValue)
syncRef(_modelValue, modelValue)

const rootRef = useTemplateRef<HTMLElement>("rootRef")

function select(value: PageControlValue) {
    if (props.disabled) return
    if (modelValue.value === value) return

    modelValue.value = value
}

provide(pageControlInjectionKey, {
    rootRef,
    value: modelValue,
    disabled: toRef(props, "disabled"),
    orientation: toRef(props, "orientation"),
    select: select,
})
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
        :aria-orientation="props.orientation"
        :class="cn('flex items-center', props.class)">
        <slot />
    </div>
</template>
