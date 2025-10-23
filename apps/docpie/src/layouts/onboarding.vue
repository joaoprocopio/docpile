<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query"

import { Avatar, AvatarFallback } from "~/lib/ui/avatar"
import { Button } from "~/lib/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/lib/ui/dropdown-menu"
import { authQueries } from "~/state/auth/query"
import { composeInitials } from "~/utils/avatar"

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
                        <DropdownMenuItem>
                            <Icon
                                name="lucide:log-out"
                                class="text-muted-foreground" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div class="mx-auto max-w-md py-10">
            <div class="mt-6 px-6">
                <slot />
            </div>
        </div>
    </div>
</template>
