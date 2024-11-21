<template>
  <NyxButton class="rounded-full" variant="secondary" size="icon" @click="isDark = !isDark">
    <Icon class="size-4" :name="isDark ? 'lucide:moon' : 'lucide:sun'" />
  </NyxButton>
</template>

<script setup lang="ts">
  const colorMode = useColorMode()
  const isDark = computed({
    get() {
      return colorMode.value === "dark"
    },
    set() {
      colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
    },
  })
</script>
