<script setup lang="ts">
import { SignupRouteName } from "~/constants/routes"
import { Button } from "~/lib/ui/components/button"
import { Input } from "~/lib/ui/components/input"
import { Separator } from "~/lib/ui/components/separator"
</script>

<template>
    <div class="container mx-auto max-w-sm">
        <div class="flex flex-col items-center px-6 py-16">
            <!-- TODO: consertar as alturas daqui junto com a tipografia -->
            <Icon
                name="lucide:library-big"
                class="logo size-12 first:!stroke-[1px]">
                <template #default> asdf </template>
            </Icon>

            <h1 class="text-title-3 mt-8 font-semibold">Sign in to Docpie</h1>

            <Button class="text-subheadline mt-6 w-full"> Continue with Google </Button>

            <Separator class="mt-8" />

            <Input
                class="text-subheadline mt-8"
                placeholder="Enter your email address..." />

            <Button
                class="text-subheadline mt-4 w-full"
                variant="secondary">
                Continue with email
            </Button>

            <p
                class="text-footnote text-muted xs:flex-row mt-8 flex flex-col items-center gap-x-1 gap-y-0.5">
                Don't have an account?
                <NuxtLink
                    :to="{ name: SignupRouteName }"
                    class="text-foreground font-semibold">
                    Sign up
                </NuxtLink>
            </p>
        </div>
    </div>
</template>
