<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { useRouter } from "vue-router"

import { SignInRouteName } from "~/lib/router/constants"
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

const router = useRouter()
const client = useQueryClient()

const user = useQuery(authQueries.whoami())
const signout = useMutation({
    ...authMutations.signOut(),
    onSuccess: () => {
        client.removeQueries({ queryKey: authQueries.all() })
        router.push({ name: SignInRouteName })
    },
})
</script>

<template>
    <div class="h-full bg-gradient-auth">
        <div class="flex justify-center px-6 py-4 sm:justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button
                        v-if="user.isSuccess.value"
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

        <div class="mx-auto max-w-md py-6 sm:py-10">
            <div class="px-6">
                <NuxtPage />
            </div>
        </div>
    </div>
</template>
