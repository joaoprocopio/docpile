<script setup lang="ts">
import { useMutation, useQuery } from "~/lib/cache"
import { Avatar, AvatarFallback } from "~/lib/ui/avatar"
import { Button } from "~/lib/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/lib/ui/dropdown-menu"
import { cn } from "~/lib/ui/utils"
import { authCache } from "~/state/auth/cache"
import { composeInitials } from "~/utils/avatar"

const props = defineProps<{
    class?: string
}>()

const whoami = useQuery(authCache.queries.whoami())
const signout = useMutation(authCache.mutations.signout())
</script>

<template>
    <DropdownMenu v-if="whoami.isSuccess.value">
        <DropdownMenuTrigger as-child>
            <Button
                v-bind="$attrs"
                variant="ghost"
                :class="cn('h-fit w-fit px-5! py-2', props.class)">
                <Avatar class="size-6 rounded-sm">
                    <AvatarFallback class="rounded-none text-3xs">
                        {{ composeInitials(whoami.data.value!.display_name) }}
                    </AvatarFallback>
                </Avatar>

                <p class="truncate text-xs">{{ whoami.data.value!.email }}</p>

                <Icon
                    name="lucide:chevron-down"
                    class="ml-auto size-4 text-sidebar-muted-foreground" />
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
