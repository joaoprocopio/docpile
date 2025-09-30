<script setup lang="ts">
import { SigninRouteName } from "~/constants/routes"
</script>

<template>
    <div class="container mx-auto max-w-sm">
        <NuxtLink :to="{ name: SigninRouteName }"> go to signin route </NuxtLink>
    </div>
</template>
