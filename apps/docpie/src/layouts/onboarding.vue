<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"

import { Button } from "~/lib/ui/button"
import { authQueries } from "~/state/auth/query"

const user = useQuery(authQueries.whoami())
</script>

<template>
    <div class="h-full bg-gradient-auth">
        <div class="flex items-center justify-between px-6 py-4">
            <Button
                disabled
                class="rounded-full"
                size="icon"
                variant="secondary">
                <Icon
                    class="size-5"
                    name="lucide:arrow-left" />
            </Button>

            <div v-if="user.isSuccess.value">
                <p class="text-xs">
                    {{ user.data.value!.email }}
                </p>
            </div>
        </div>

        <div class="mx-auto max-w-md py-10">
            <div class="mt-6 px-6">
                <slot />
            </div>
        </div>
    </div>
</template>
