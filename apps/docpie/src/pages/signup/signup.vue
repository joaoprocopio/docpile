<script setup lang="ts">
import { LoginRouteName } from "~/constants/routes"
</script>

<template>
    <div class="container mx-auto max-w-sm">
        <NuxtLink :to="{ name: LoginRouteName }"> Login </NuxtLink>
    </div>
</template>
