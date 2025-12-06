<script setup lang="ts">
import { useRoute } from "#app"
import { useQuery } from "@tanstack/vue-query"
import { watchEffect } from "vue"
import { Spinner } from "~/lib/ui/spinner"
import { authCache } from "~/state/auth/cache"
import { orgCache } from "~/state/org/cache"

const route = useRoute()

const whoami = useQuery(authCache.queries.whoami())
const invitation = useQuery(
    orgCache.queries.resolveInviteToken({
        slug: route.params.slug as string,
        token: route.params.token as string,
    }),
)

watchEffect(() => {
    if (whoami.isSuccess.value && invitation.isSuccess.value) {
        throw new Error("TODO: Not implemented")
    }
})
</script>

<template>
    <div class="flex h-full flex-col items-center justify-center">
        <Spinner class="size-12" />
    </div>
</template>
