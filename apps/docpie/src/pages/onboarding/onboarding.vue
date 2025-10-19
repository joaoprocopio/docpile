<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"

import { authQueries } from "~/state/auth/query"

const user = useQuery(authQueries.whoami())
</script>

<template>
    <div>
        {{ user.data }}
    </div>
</template>
