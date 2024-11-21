<script setup lang="ts">
  import type { ButtonProps } from "."
  import { buttonVariants } from "."

  const props = withDefaults(defineProps<ButtonProps>(), {
    as: "button",
  })
</script>

<template>
  <InternalPrimitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </InternalPrimitive>
</template>
