<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
    <VueQueryDevtools />
</template>

<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query"

import { VueQueryDevtools } from "~/lib/query/devtools"
import { authQueries } from "~/query/auth"

const queryClient = useQueryClient()
queryClient.prefetchQuery(authQueries.whoami())
</script>
