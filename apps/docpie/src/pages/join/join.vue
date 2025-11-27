<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"
import { toRaw, watchEffect } from "vue"

import { useRoute, useRouter } from "#app"
import { AuthRoutes } from "~/lib/router/constants"
import { Spinner } from "~/lib/ui/spinner"
import { authCache } from "~/state/auth/cache"
import { orgCache } from "~/state/org/cache"
import { isNil } from "~/utils/is"

const router = useRouter()
const route = useRoute()

const whoamiQuery = useQuery(authCache.queries.whoami())
const invitationQuery = useQuery(
    orgCache.queries.resolveInviteToken({
        slug: route.params.slug as string,
        token: route.params.token as string,
    }),
)

watchEffect(() => {
    if (whoamiQuery.isSuccess.value && invitationQuery.isSuccess.value) {
        throw new Error("TODO: Not implemented")
    }
})
</script>

<template>
    <div class="flex h-full flex-col items-center justify-center">
        <Spinner class="size-12" />
    </div>
</template>
