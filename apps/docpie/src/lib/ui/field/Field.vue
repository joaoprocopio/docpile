<!-- TODO: tornar componente genérico -->

<script setup lang="ts">
import type { AnyFieldApi } from "@tanstack/vue-form"
import { useStore } from "@tanstack/vue-form"
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

import type { FieldVariants } from "."
import { fieldVariants } from "."

const props = defineProps<{
    field: AnyFieldApi
    class?: HTMLAttributes["class"]
    orientation?: FieldVariants["orientation"]
}>()

const isInvalid = useStore(
    props.field.store,
    (state) => state.meta.isTouched && !state.meta.isValid,
)
</script>

<template>
    <div
        role="group"
        data-slot="field"
        :data-invalid="isInvalid"
        :data-orientation="orientation"
        :class="cn(fieldVariants({ orientation }), props.class)">
        <slot
            v-bind="{
                isInvalid: isInvalid,
            }" />
    </div>
</template>
