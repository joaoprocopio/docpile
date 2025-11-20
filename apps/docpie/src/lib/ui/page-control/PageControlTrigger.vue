<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { computed, ref } from "vue"

import { cn } from "~/lib/ui/utils"

import {
    type PageControlTriggerState,
    type PageControlValue,
    usePageControlContext,
} from "./context"

const props = withDefaults(
    defineProps<
        {
            value: PageControlValue
            disabled?: boolean
            class?: HTMLAttributes["class"]
        } & PrimitiveProps
    >(),
    {
        class: undefined,
        as: "button",
    },
)

const context = usePageControlContext()
const triggerRef = ref<HTMLButtonElement | null>(null)

const state = computed<PageControlTriggerState>(() => {
    if (isDisabled.value) return "disabled"

    return context.value.value === props.value ? "active" : "reachable"
})
const isDisabled = computed(() => context.disabled.value || props.disabled)

function handleSelect(event: Event) {
    if (isDisabled.value) {
        event.preventDefault()
        return
    }

    context.select(props.value)
}

function getTriggers() {
    const root = context.rootRef.value

    if (!root) {
        return []
    }

    return Array.from(
        root.querySelectorAll<HTMLButtonElement>("[data-slot='page-control-trigger']"),
    )
}

function focusBy(step: 1 | -1) {
    const triggers = getTriggers()
    const current = triggerRef.value

    if (!current || triggers.length === 0) {
        return
    }

    let index = triggers.indexOf(current)

    if (index === -1) {
        return
    }

    for (let attempt = 0; attempt < triggers.length; attempt++) {
        index += step

        const next = triggers[index]

        if (!next || next.dataset.disabled === "true" || next.hasAttribute("data-disabled")) {
            continue
        }

        next.focus()
        break
    }
}

function handleKeydown(event: KeyboardEvent) {
    const key = event.key
    const isHorizontal = context.orientation.value === "horizontal"

    if (isHorizontal && key === "ArrowRight") {
        event.preventDefault()
        focusBy(1)
        return
    }

    if (isHorizontal && key === "ArrowLeft") {
        event.preventDefault()
        focusBy(-1)
        return
    }

    if (!isHorizontal && key === "ArrowDown") {
        event.preventDefault()
        focusBy(1)
        return
    }

    if (!isHorizontal && key === "ArrowUp") {
        event.preventDefault()
        focusBy(-1)
        return
    }

    if (key === "Home") {
        event.preventDefault()
        const triggers = getTriggers()
        const firstEnabled = triggers.find(
            (trigger) => !trigger.dataset.disabled && !trigger.hasAttribute("data-disabled"),
        )
        firstEnabled?.focus()
        return
    }

    if (key === "End") {
        event.preventDefault()
        const triggers = getTriggers()
        for (let i = triggers.length - 1; i >= 0; i--) {
            const trigger = triggers[i]
            if (!trigger || trigger.dataset.disabled || trigger.hasAttribute("data-disabled")) {
                continue
            }
            trigger.focus()
            break
        }
        return
    }

    if (key === "Enter" || key === " ") {
        event.preventDefault()
        handleSelect(event)
    }
}
</script>

<template>
    <Primitive
        ref="triggerRef"
        type="button"
        role="tab"
        data-slot="page-control-trigger"
        :as="props.as"
        :as-child="props.asChild"
        :data-state="state"
        :data-disabled="isDisabled ? '' : undefined"
        :aria-selected="state === 'active'"
        :aria-disabled="isDisabled || undefined"
        :tabindex="isDisabled ? -1 : 0"
        :class="
            cn(
                'group inline-flex items-center justify-center rounded-full px-2.5 py-2 transition outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50',
                props.class,
            )
        "
        @click="handleSelect"
        @keydown="handleKeydown">
        <slot />
    </Primitive>
</template>
