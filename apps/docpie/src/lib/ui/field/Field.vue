<!-- TODO: tornar componente genérico -->

<script setup lang="ts">
import type { AnyFieldApi } from "@tanstack/vue-form"
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

import type { FieldVariants } from "."
import { fieldVariants } from "."

const props = defineProps<{
    field: AnyFieldApi
    class?: HTMLAttributes["class"]
    orientation?: FieldVariants["orientation"]
}>()

// Since `@tanstack/vue-form` is all based on re-renders, it's better to wrap the logic into getter functions.
//
function isFieldInvalid() {
    return props.field.state.meta.isTouched && !props.field.state.meta.isValid
}
</script>

<template>
    <div
        role="group"
        data-slot="field"
        :data-invalid="isFieldInvalid()"
        :data-orientation="orientation"
        :class="cn(fieldVariants({ orientation }), props.class)">
        <slot
            v-bind="{
                isInvalid: isFieldInvalid(),
            }" />
    </div>
</template>
