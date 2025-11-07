<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"

import { rerunMiddleware } from "~/ext/vue-router/utils"
import { Avatar, AvatarFallback } from "~/lib/ui/avatar"
import { Button } from "~/lib/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/lib/ui/dropdown-menu"
import { authMutations, authQueries } from "~/state/auth/query"
import { composeInitials } from "~/utils/avatar"

const client = useQueryClient()

const user = useQuery(authQueries.whoami())
const signout = useMutation({
    ...authMutations.signOut(),
    onSuccess: () => {
        client.removeQueries({ queryKey: authQueries.all() })
        rerunMiddleware()
    },
})
</script>

<template>
    <div class="h-full bg-gradient-auth">
        <div class="flex items-center justify-center gap-4 px-6 py-4 sm:justify-end">
            <DropdownMenu v-if="user.isSuccess.value">
                <DropdownMenuTrigger as-child>
                    <Button
                        variant="ghost"
                        class="w-fit p-1">
                        <Avatar class="size-6 rounded-sm">
                            <AvatarFallback class="rounded-none text-3xs">
                                {{ composeInitials(user.data.value!.display_name) }}
                            </AvatarFallback>
                        </Avatar>

                        <p class="truncate text-xs">{{ user.data.value!.email }}</p>

                        <Icon
                            name="lucide:chevron-down"
                            class="text-sidebar-muted-foreground ml-auto size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    class="w-(--reka-dropdown-menu-trigger-width) min-w-48"
                    align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem @click="() => signout.mutate()">
                            <Icon
                                name="lucide:log-out"
                                class="text-muted-foreground" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div class="mx-auto max-w-md px-6 py-6 sm:py-10">
            <slot />
        </div>
    </div>
</template>
