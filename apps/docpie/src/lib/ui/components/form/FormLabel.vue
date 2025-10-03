<script lang="ts" setup>
import type { LabelProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { Label } from "~/lib/ui/components/label"
import { cn } from "~/lib/ui/utils"

import { useFormField } from "./useFormField"

const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>()

const { error, formItemId } = useFormField()
</script>

<template>
    <Label
        data-slot="form-label"
        :data-error="!!error"
        :class="cn('text-xs data-[error=true]:text-destructive-foreground', props.class)"
        :for="formItemId">
        <slot />
    </Label>
</template>
