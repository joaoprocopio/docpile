<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"

import { useRoute } from "#app"
import { Spinner } from "~/lib/ui/spinner"
import { orgCache } from "~/state/org/cache"

const route = useRoute()
const invitation = useQuery(
    orgCache.queries.resolveInviteToken({
        slug: route.params.slug as string,
        token: route.params.token as string,
    }),
)
</script>

<template>
    <div class="flex h-full flex-col items-center justify-center">
        {{ invitation.data }}
        <Spinner class="size-12" />
    </div>
</template>
