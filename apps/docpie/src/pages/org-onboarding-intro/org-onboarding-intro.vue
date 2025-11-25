<script setup lang="ts">
import { useRouter } from "#app"
import { OrgRoutes } from "~/lib/router/constants"
import { Button } from "~/lib/ui/button"

const router = useRouter()
</script>

<template>
    <div class="flex flex-col items-center">
        <Icon
            name="lucide-lab:pie"
            class="mx-auto size-12" />

        <div class="mt-8 space-y-2 text-center">
            <h1 class="text-2xl font-semibold">Welcome to Docpie</h1>
            <div class="space-y-1.5 text-xs text-muted-foreground">
                <p>Docpie is a well-rounded documentation management system.</p>
                <p>Bring together members, teams and docs.</p>
            </div>
        </div>

        <Button
            class="mt-12 min-w-56"
            variant="secondary"
            :to="{ name: OrgRoutes.Onboarding.Theme }">
            Get started
        </Button>
    </div>
</template>
