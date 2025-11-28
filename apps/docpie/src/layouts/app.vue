<script setup lang="ts">
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
    SidebarRail,
    SidebarTrigger,
    SidebarWrapper,
} from "~/lib/ui/sidebar"
import { isNil } from "~/utils/is"

interface Group {
    group?: string
    items?: Item[]
}

interface Item {
    label: string
    icon?: string
    route?: string
}

const groups: Group[] = [
    {
        items: [
            {
                label: "Buscar",
                icon: "lucide:search",
            },
            {
                label: "Início",
                icon: "lucide:house",
            },
        ],
    },

    {
        group: "Logística",
        items: [
            {
                label: "Produtos",
                icon: "lucide:package-open",
            },
            {
                label: "Propostas",
                icon: "lucide:file-text",
            },
            {
                label: "Pedidos",
                icon: "lucide:truck",
            },
        ],
    },
]
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
                                <Avatar class="size-6 rounded-sm">
                                    <AvatarFallback
                                        class="rounded-none bg-sidebar-primary text-3xs text-sidebar-primary-foreground">
                                        RC
                                    </AvatarFallback>
                                </Avatar>

                                <span class="truncate text-xs"> Roger Camargo </span>

                                <Icon
                                    name="lucide:chevron-down"
                                    class="text-sidebar-muted-foreground ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            class="min-w-56"
                            align="start"
                            side="bottom">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Icon name="lucide:log-out" />
                                    Sair
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
                                        <Icon
                                            name="lucide:chevron-down"
                                            class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
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

            <SidebarRail />
        </Sidebar>

        <SidebarInset>
            <div class="shrink-0 grow basis-auto">
                <slot />
            </div>
        </SidebarInset>
    </SidebarWrapper>
</template>
