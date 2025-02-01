<template>
  <div>
    <header class="flex h-16 items-center px-6">
      <h1 class="text-3xl font-semibold">foo</h1>

      <NyxButton class="rounded-full" variant="secondary" size="icon" @click="isDark = !isDark">
        <Icon class="size-4" :name="isDark ? 'lucide:moon' : 'lucide:sun'" />
      </NyxButton>
    </header>

    <main>
      <slot />
    </main>
  </div>
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
