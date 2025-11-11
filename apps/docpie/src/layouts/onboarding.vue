<script setup lang="ts">
import { UserMenu } from "~/components/user-menu"
</script>

<template>
    <div class="grid h-full grid-cols-1 grid-rows-[auto_1fr_auto] bg-gradient-auth">
        <div class="mx-auto px-6 py-4 sm:ml-auto">
            <UserMenu />
        </div>

        <div class="mx-auto w-full max-w-md px-6 py-10">
            <slot />
        </div>
    </div>
</template>
