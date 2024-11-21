<script setup lang="ts">
  import type { ButtonProps } from "."
  import { buttonVariants } from "."

  const props = withDefaults(defineProps<ButtonProps>(), {
    as: "button",
  })
</script>

<template>
  <InternalPrimitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)">
    <slot />
  </InternalPrimitive>
</template>
