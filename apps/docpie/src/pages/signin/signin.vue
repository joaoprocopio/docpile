<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"

import { SignupRouteName } from "~/constants/routes"
import { Button } from "~/lib/ui/components/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/lib/ui/components/form"
import { Input } from "~/lib/ui/components/input"
import { SigninIdentify } from "~/schemas/auth"
</script>

<template>
    <div class="mx-auto max-w-sm">
        <div class="flex flex-col items-center px-6 py-10 sm:py-16">
            <Icon
                name="lucide:library-big"
                class="logo size-12" />

            <h1 class="mt-6 text-lg font-semibold">Sign in to Docpie</h1>

            <Form
                class="mt-8 flex w-full flex-col gap-y-5"
                :validation-schema="toTypedSchema(SigninIdentify)"
                @submit="
                    (values, ctx) => {
                        console.log(values)
                        console.log(ctx)
                    }
                ">
                <FormField
                    v-slot="field"
                    name="email">
                    <FormItem>
                        <FormLabel class="sr-only">Email</FormLabel>
                        <FormControl>
                            <Input
                                v-bind="field.componentField"
                                placeholder="Enter your email address..." />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <Button
                    type="submit"
                    variant="secondary">
                    Continue with email
                </Button>
            </Form>

            <p
                class="mt-8 flex flex-col items-center gap-x-1 text-2xs text-muted-foreground xs:flex-row">
                <span> Don't have an account? </span>
                <NuxtLink
                    :to="{ name: SignupRouteName }"
                    class="font-semibold text-foreground">
                    Sign up
                </NuxtLink>
            </p>
        </div>
    </div>
</template>
