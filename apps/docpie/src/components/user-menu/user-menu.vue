<script setup lang="ts">
import { rerunMiddleware } from "~/ext/vue-router/utils"
import { useMutation, useQuery, useQueryClient } from "~/lib/cache"
import { Avatar, AvatarFallback } from "~/lib/ui/avatar"
import { Button } from "~/lib/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/lib/ui/dropdown-menu"
import { authCache } from "~/state/auth/cache"
import { composeInitials } from "~/utils/avatar"

const client = useQueryClient()

const user = useQuery(authCache.queries.whoami())
const signout = useMutation({
    ...authCache.mutations.signout(),
    onSuccess: () => {
        client.removeQueries({ queryKey: authCache.keys.queries.all() })
        rerunMiddleware()
    },
})
</script>

<template>
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
</template>
