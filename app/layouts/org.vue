<script setup lang="ts">
import { composeInitials } from "#shared/utils/avatar"
import { isNil } from "#shared/utils/is"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { OrgRoutes } from "~/lib/router/constants"
import { Avatar, AvatarFallback } from "~/lib/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/lib/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/lib/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    SidebarWrapper,
} from "~/lib/ui/sidebar"
import { Triangle } from "~/lib/ui/triangle"
import { authCache } from "~/state/auth/cache"

// TODO: separar em componentes

interface Group {
    group?: string
    items?: Item[]
}

interface Item {
    label: string
    icon?: string
    route?: string
}

// TODO: consertar os links que apontam para lugares nada ver
const groups: Group[] = [
    {
        items: [
            {
                label: "Search",
                icon: "lucide:search",
                route: OrgRoutes.Home.value,
            },
            {
                label: "Inbox",
                icon: "lucide:inbox",
                route: OrgRoutes.Create.value,
            },
        ],
    },

    {
        group: "Organization",
        items: [
            {
                label: "Members",
                icon: "lucide:users",
                route: OrgRoutes.Create.value,
            },
            {
                label: "Teams",
                icon: "lucide:contact",
                route: OrgRoutes.Create.value,
            },
            {
                label: "Docs",
                icon: "lucide:files",
                route: OrgRoutes.Create.value,
            },
            {
                label: "Sites",
                icon: "lucide:globe",
                route: OrgRoutes.Create.value,
            },
        ],
    },

    {
        group: "Docs",
        items: [
            {
                label: "Roboflow Inference",
                icon: "lucide:folder-closed",
                route: OrgRoutes.Create.value,
            },
            {
                label: "Roboflow Supervision",
                icon: "lucide:folder-closed",
                route: OrgRoutes.Create.value,
            },
            {
                label: "Roboflow Python",
                icon: "lucide:folder-closed",
                route: OrgRoutes.Create.value,
            },
        ],
    },
]

const whoami = useQuery(authCache.queries.whoami())
const signout = useMutation(authCache.mutations.signout())
</script>

<template>
    <SidebarWrapper>
        <Sidebar
            collapsible="offcanvas"
            variant="sidebar"
            v-bind="$attrs">
            <SidebarHeader>
                <div class="flex items-center justify-between gap-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <SidebarMenuButton class="w-fit p-1">
                                <template v-if="whoami.isSuccess.value">
                                    <Avatar class="size-6 rounded-sm">
                                        <AvatarFallback
                                            class="rounded-none bg-sidebar-primary text-2xs text-sidebar-primary-foreground">
                                            {{ composeInitials(whoami.data.value!.display_name) }}
                                        </AvatarFallback>
                                    </Avatar>

                                    <span class="truncate text-xs">{{
                                        whoami.data.value!.display_name
                                    }}</span>

                                    <Icon
                                        name="lucide:chevron-down"
                                        class="ml-auto size-4 text-sidebar-muted-foreground" />
                                </template>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            class="min-w-56"
                            align="start"
                            side="bottom">
                            <DropdownMenuGroup>
                                <DropdownMenuItem @click="() => signout.mutate()">
                                    <Icon
                                        class="text-muted-foreground"
                                        name="lucide:log-out" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <SidebarTrigger />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <template
                    v-for="(group, groupIndex) in groups"
                    :key="groupIndex">
                    <template v-if="!isNil(group.group)">
                        <Collapsible
                            default-open
                            class="group/collapsible">
                            <SidebarGroup>
                                <SidebarGroupLabel
                                    as-child
                                    class="hover:bg-sidebar-accent">
                                    <CollapsibleTrigger>
                                        <span> {{ group.group }}</span>
                                        <Triangle
                                            class="ml-2 transition-transform group-data-[state=closed]/collapsible:rotate-180" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>

                                <CollapsibleContent class="py-0.5">
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            <SidebarMenuItem
                                                v-for="(item, itemIndex) in group.items"
                                                :key="itemIndex">
                                                <RouterLink
                                                    v-slot="link"
                                                    :to="{ name: item.route }"
                                                    custom>
                                                    <SidebarMenuButton
                                                        as-child
                                                        :is-active="
                                                            link.isActive && 'route' in item
                                                        "
                                                        :aria-disabled="!item.route">
                                                        <RouterLink :to="link.href">
                                                            <Icon
                                                                v-if="item.icon"
                                                                class="text-sidebar-muted-foreground"
                                                                :name="item.icon" />

                                                            <span>
                                                                {{ item.label }}
                                                            </span>
                                                        </RouterLink>
                                                    </SidebarMenuButton>
                                                </RouterLink>
                                            </SidebarMenuItem>
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    </template>

                    <template v-else>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem
                                        v-for="(item, itemIndex) in group.items"
                                        :key="itemIndex">
                                        <RouterLink
                                            v-slot="link"
                                            :to="{ name: item.route }"
                                            custom>
                                            <SidebarMenuButton
                                                as-child
                                                :is-active="link.isActive && 'route' in item"
                                                :aria-disabled="!item.route">
                                                <RouterLink :to="link.href">
                                                    <Icon
                                                        v-if="item.icon"
                                                        class="text-sidebar-muted-foreground"
                                                        :name="item.icon" />
                                                    <span>
                                                        {{ item.label }}
                                                    </span>
                                                </RouterLink>
                                            </SidebarMenuButton>
                                        </RouterLink>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </template>
                </template>
            </SidebarContent>
        </Sidebar>

        <SidebarInset>
            <div class="shrink-0 grow basis-auto">
                <slot />
            </div>
        </SidebarInset>
    </SidebarWrapper>
</template>
