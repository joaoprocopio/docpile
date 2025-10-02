<script setup lang="ts">
import { SignupRouteName } from "~/constants/routes"
import { Button } from "~/lib/ui/components/button"
import { Input } from "~/lib/ui/components/input"
</script>

<template>
    <div class="mx-auto max-w-sm">
        <div class="flex flex-col items-center px-6 py-10 sm:py-16">
            <Icon
                name="lucide:library-big"
                class="logo size-12" />

            <h1 class="mt-8 text-lg font-semibold">Sign in to Docpie</h1>

            <Input
                class="mt-8"
                placeholder="Enter your email address..." />

            <Button
                class="mt-4 w-full"
                variant="default">
                Continue with email
            </Button>

            <p
                class="text-muted-foreground xs:flex-row text-2xs mt-8 flex flex-col items-center gap-x-1">
                <span> Don't have an account? </span>
                <NuxtLink
                    :to="{ name: SignupRouteName }"
                    class="text-foreground font-semibold">
                    Sign up
                </NuxtLink>
            </p>
        </div>
    </div>
</template>
