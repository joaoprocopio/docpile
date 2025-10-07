<template>
    <div>
        <div
            v-if="user.isLoading.value"
            class="h-full bg-gradient-auth" />

        <div v-show="!user.isLoading.value">
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </div>

        <VueQueryDevtools />
    </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"
import { watch } from "vue"

import { SignInRouteName, SignUpRouteName } from "~/constants/routes"
import { VueQueryDevtools } from "~/lib/query/devtools"
import { authQueries } from "~/query/auth"

const user = useQuery(authQueries.me())

watch(user.data, (user) => {
    console.log(user)
})

const _AuthRoutes = new Set([SignInRouteName, SignUpRouteName])
</script>
