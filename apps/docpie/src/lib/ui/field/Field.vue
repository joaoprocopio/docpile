<script
    setup
    lang="ts"
    generic="
        TParentData,
        TName extends DeepKeys<TParentData>,
        TData extends DeepValue<TParentData, TName>,
        TOnMount extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
        TOnChange extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
        TOnChangeAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
        TOnBlur extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
        TOnBlurAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
        TOnSubmit extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
        TOnSubmitAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
        TOnDynamic extends undefined | FieldValidateOrFn<TParentData, TName, TData>,
        TOnDynamicAsync extends undefined | FieldAsyncValidateOrFn<TParentData, TName, TData>,
        TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
        TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
        TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
        TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
        TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
        TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
        TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
        TFormOnDynamic extends undefined | FormValidateOrFn<TParentData>,
        TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
        TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
        TParentSubmitMeta
    ">
import type {
    DeepKeys,
    DeepValue,
    FieldApi,
    FieldAsyncValidateOrFn,
    FieldValidateOrFn,
    FormAsyncValidateOrFn,
    FormValidateOrFn,
} from "@tanstack/vue-form"
import { useStore } from "@tanstack/vue-form"
import type { HTMLAttributes } from "vue"

import { cn } from "~/lib/ui/utils"

import type { FieldVariants } from "."
import { fieldVariants } from "."

const props = defineProps<{
    field: FieldApi<
        TParentData,
        TName,
        TData,
        TOnMount,
        TOnChange,
        TOnChangeAsync,
        TOnBlur,
        TOnBlurAsync,
        TOnSubmit,
        TOnSubmitAsync,
        TOnDynamic,
        TOnDynamicAsync,
        TFormOnMount,
        TFormOnChange,
        TFormOnChangeAsync,
        TFormOnBlur,
        TFormOnBlurAsync,
        TFormOnSubmit,
        TFormOnSubmitAsync,
        TFormOnDynamic,
        TFormOnDynamicAsync,
        TFormOnServer,
        TParentSubmitMeta
    >
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
        <slot v-bind="{ isInvalid: isInvalid }" />
    </div>
</template>
