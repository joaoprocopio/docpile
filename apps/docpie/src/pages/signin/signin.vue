<script setup lang="ts">
import { useIsMutating, useMutation, useQueryClient } from "@tanstack/vue-query"
import { toTypedSchema } from "@vee-validate/zod"
import { useToggle } from "@vueuse/core"
import { useForm } from "vee-validate"
import { computed } from "vue"

import { SignUpRouteName } from "~/lib/router/constants"
import { Button } from "~/lib/ui/components/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/lib/ui/components/form"
import { Input } from "~/lib/ui/components/input"
import { authMutations, authQueries } from "~/query/auth"
import { SignIn } from "~/schemas/auth"

const queryClient = useQueryClient()

const form = useForm({ validationSchema: toTypedSchema(SignIn) })
const submit = form.handleSubmit((values) => mutation.mutate(values))

const mutation = useMutation({
    ...authMutations.signIn(),
    onSuccess(data) {
        queryClient.setQueryData(authQueries.whoami().queryKey, data)
    },
    onError: () => {
        form.setErrors({
            email: "Email may be invalid",
            password: "Password may be invalid",
        })
    },
})
const isMutating = useIsMutating({
    mutationKey: authMutations.signIn().mutationKey,
})
const isLoading = computed(() => Boolean(isMutating.value))

const [showPassword, toggleShowPassword] = useToggle(false)
</script>

<template>
    <div class="flex flex-col items-center">
        <h1 class="text-lg font-semibold">Sign in to Docpie</h1>

        <form
            class="mt-8 flex w-full flex-col gap-y-5"
            @submit="submit">
            <div class="flex flex-col gap-y-3">
                <FormField
                    v-slot="field"
                    name="email">
                    <FormItem>
                        <FormLabel class="sr-only">Email</FormLabel>
                        <FormControl>
                            <Input
                                v-bind="field.componentField"
                                autocomplete="email"
                                placeholder="Enter your email address..." />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField
                    v-slot="field"
                    name="password">
                    <FormItem>
                        <FormLabel class="sr-only">Password</FormLabel>
                        <div class="relative">
                            <FormControl>
                                <Input
                                    v-bind="field.componentField"
                                    :type="showPassword ? 'text' : 'password'"
                                    autocomplete="current-password"
                                    placeholder="Enter your password..."
                                    class="pr-9">
                                </Input>
                            </FormControl>

                            <Button
                                class="absolute top-0 right-0 m-1 size-7 text-muted-foreground"
                                type="button"
                                size="icon"
                                variant="ghost"
                                @click="() => toggleShowPassword()">
                                <Icon
                                    class="size-4"
                                    :name="showPassword ? 'lucide:eye' : 'lucide:eye-off'" />
                            </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>

            <Button
                :disabled="isLoading"
                type="submit"
                variant="secondary">
                Sign in with email
            </Button>
        </form>

        <p
            class="mt-8 flex flex-col items-center gap-x-1 text-2xs text-muted-foreground xs:flex-row">
            <span> Don't have an account? </span>
            <NuxtLink
                :to="{ name: SignUpRouteName }"
                class="font-semibold text-foreground">
                Sign up
            </NuxtLink>
        </p>
    </div>
</template>
