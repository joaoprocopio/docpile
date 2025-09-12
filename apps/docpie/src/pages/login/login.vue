<script setup lang="ts">
import { Button } from "~/lib/ui/components/button"
import { Input } from "~/lib/ui/components/input"
import { Separator } from "~/lib/ui/components/separator"
</script>

<template>
    <div class="container mx-auto max-w-sm">
        <div class="flex flex-col items-center py-24">
            <!-- TODO: consertar as alturas daqui junto com a tipografia -->
            <Icon
                name="lucide:library-big"
                class="!size-12" />

            <h1 class="text-title-3 mt-8">Sign in to Docpie</h1>

            <Button class="mt-6 w-full"> Continue with Google </Button>

            <Separator class="mt-8" />

            <Input
                class="text-subheadline mt-8"
                placeholder="Enter your email address..." />

            <Button
                class="mt-4 w-full"
                variant="secondary">
                Continue with email
            </Button>

            <p class="text-caption-1 text-muted mt-8">
                Don't have an account? <span class="text-foreground font-bold">Sign up</span>
            </p>
        </div>
    </div>
</template>
