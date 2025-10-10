<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { toTypedSchema } from "@vee-validate/zod"
import { useToggle } from "@vueuse/core"
import { useForm } from "vee-validate"

import { authMutations, authQueries } from "~/lib/auth/query"
import { SignUp } from "~/lib/auth/schemas"
import { SignInRouteName } from "~/lib/router/constants"
import { Button } from "~/lib/ui/components/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/lib/ui/components/form"
import { Input } from "~/lib/ui/components/input"

const client = useQueryClient()

const form = useForm({ validationSchema: toTypedSchema(SignUp) })
const submit = form.handleSubmit((values) => mutation.mutate(values))

const mutation = useMutation({
    ...authMutations.signUp(),
    onSuccess(data) {
        client.setQueryData(authQueries.whoami().queryKey, data)
    },
    onError: () => {
        form.setErrors({
            email: "Email may be invalid",
            password: "Password may be invalid",
        })
    },
})

const [showPassword, toggleShowPassword] = useToggle(false)
</script>

<template>
    <div class="flex flex-col items-center">
        <h1 class="text-lg font-semibold">Sign up to Docpie</h1>

        <form
            class="mt-8 flex w-full flex-col gap-y-5"
            @submit="submit">
            <div class="flex flex-col gap-y-3">
                <FormField
                    v-slot="field"
                    name="display_name">
                    <FormItem>
                        <FormLabel class="sr-only">Name</FormLabel>
                        <FormControl>
                            <Input
                                v-bind="field.componentField"
                                placeholder="Enter your name..." />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

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

                <FormField
                    v-slot="field"
                    name="password">
                    <FormItem>
                        <FormLabel class="sr-only">Password</FormLabel>
                        <FormControl>
                            <div class="relative">
                                <Input
                                    v-bind="field.componentField"
                                    class="pr-9"
                                    :type="showPassword ? 'text' : 'password'"
                                    placeholder="Enter your password..." />

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
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>

            <Button
                type="submit"
                variant="secondary">
                Continue with email
            </Button>
        </form>

        <p
            class="mt-8 flex flex-col items-center gap-x-1 text-center text-2xs text-muted-foreground xs:flex-row">
            <span> Already have an account? </span>
            <NuxtLink
                :to="{ name: SignInRouteName }"
                class="font-semibold text-foreground">
                Sign in
            </NuxtLink>
        </p>
    </div>
</template>
