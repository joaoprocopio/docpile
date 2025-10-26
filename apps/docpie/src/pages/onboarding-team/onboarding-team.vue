<script setup lang="ts">
import { AppRoutes } from "~/lib/router/constants"
import { Button, buttonVariants } from "~/lib/ui/button"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "~/lib/ui/input-group"
</script>

<template>
    <div>
        <div class="space-y-1.5 text-center">
            <h1 class="text-2xl font-semibold">Invite people to your team</h1>
            <h2 class="text-xs text-muted-foreground">
                Docpie is designed around collaborative work. You can invite people now or any time.
            </h2>
        </div>

        <div class="mt-8">
            <InputGroup>
                <InputGroupInput placeholder="example@domain.com" />

                <InputGroupAddon align="inline-end">
                    <InputGroupButton variant="secondary">
                        <span>Add</span>
                        <Icon
                            name="lucide:plus"
                            class="size-3.5" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>

        <div class="mt-12 flex flex-col items-center gap-y-3">
            <Button
                class="min-w-48"
                variant="secondary">
                Send invites
            </Button>

            <RouterLink
                :class="
                    buttonVariants({
                        class: 'text-muted-foreground',
                        variant: 'ghost',
                    })
                "
                :to="{ name: AppRoutes.Home }">
                I'll do it later
            </RouterLink>
        </div>
    </div>
</template>
