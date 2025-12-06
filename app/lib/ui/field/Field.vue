<script setup lang="ts">
import type { FieldVariants } from "."
import { fieldVariants } from "."
import type { AnyFieldApi } from "@tanstack/vue-form"
import { useStore } from "@tanstack/vue-form"
import { Primitive, type PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { ref } from "vue"
import { cn } from "~/lib/ui/utils"

const props = withDefaults(
    defineProps<
        {
            field?: AnyFieldApi
            class?: HTMLAttributes["class"]
            orientation?: FieldVariants["orientation"]
        } & PrimitiveProps
    >(),
    {
        as: "div",
        asChild: false,
    },
)

const isInvalid = props.field
    ? useStore(props.field.store, (state) => state.meta.isTouched && !state.meta.isValid)
    : ref(false)
</script>

<template>
    <Primitive
        role="group"
        data-slot="field"
        :as="props.as"
        :as-child="props.asChild"
        :data-invalid="isInvalid"
        :data-orientation="orientation"
        :class="cn(fieldVariants({ orientation }), props.class)">
        <slot v-bind="{ isInvalid: isInvalid }" />
    </Primitive>
</template>
