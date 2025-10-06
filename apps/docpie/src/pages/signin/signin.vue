<script setup lang="ts">
import { useIsMutating, useMutation } from "@tanstack/vue-query"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { computed } from "vue"

import { SignupRouteName } from "~/constants/routes"
import { Button } from "~/lib/ui/components/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/lib/ui/components/form"
import { Input } from "~/lib/ui/components/input"
import { authMutations } from "~/query/auth"
import { Identify } from "~/schemas/auth"

const form = useForm({
    validationSchema: toTypedSchema(Identify),
})

const mutation = useMutation(authMutations.identify())
const isMutating = useIsMutating({
    mutationKey: authMutations.identify().mutationKey,
    exact: true,
})
const isLoading = computed(() => Boolean(isMutating.value))

const submit = form.handleSubmit(async (values) => {
    mutation.mutate(values)
})
</script>

<template>
    <div class="mx-auto max-w-sm">
        <div class="flex flex-col items-center px-6 py-10 sm:py-16">
            <Icon
                name="lucide:library-big"
                class="logo size-12" />

            <h1 class="mt-6 text-lg font-semibold">Sign in to Docpie</h1>

            <form
                class="mt-8 flex w-full flex-col gap-y-5"
                @submit="submit">
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
                    :disabled="isLoading"
                    type="submit"
                    variant="secondary">
                    <Icon
                        v-show="isLoading"
                        class="animate-spin"
                        name="lucide:loader-circle" />

                    Continue with email
                </Button>
            </form>

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
