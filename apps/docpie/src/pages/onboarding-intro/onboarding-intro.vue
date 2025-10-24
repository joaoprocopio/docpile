<script setup lang="ts">
import { OnboardingRoutes } from "~/lib/router/constants"
import { buttonVariants } from "~/lib/ui/button"
</script>

<template>
    <div class="flex flex-col items-center">
        <Icon
            name="lucide:library-big"
            class="mx-auto size-12" />

        <div class="mt-8 space-y-2 text-center">
            <h1 class="text-2xl font-semibold">Welcome to Docpie</h1>
            <div class="space-y-1.5 text-xs text-muted-foreground">
                <p>Docpie is a well-rounded documentation management system.</p>
                <p>Bring together members, teams and docs.</p>
            </div>
        </div>

        <RouterLink
            :class="
                buttonVariants({
                    class: 'mt-12 min-w-56',
                    variant: 'secondary',
                })
            "
            :to="{ name: OnboardingRoutes.Theme }">
            Get started
        </RouterLink>
    </div>
</template>
