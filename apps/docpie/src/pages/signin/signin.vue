<script setup lang="ts">
import { useForm } from "@tanstack/vue-form"
import { useIsMutating, useMutation, useQueryClient } from "@tanstack/vue-query"
import { useToggle } from "@vueuse/core"
import { computed } from "vue"

import { useRouter } from "#app"
import { authMutations, authQueries } from "~/lib/auth/query"
import { SignIn } from "~/lib/auth/schemas"
import { isFieldInvalid } from "~/lib/form/utils"
import { HomeRouteName, SignUpRouteName } from "~/lib/router/constants"
import { Button } from "~/lib/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "~/lib/ui/components/field"
import { Input } from "~/lib/ui/components/input"

const client = useQueryClient()

const router = useRouter()
const form = useForm({
    defaultValues: {
        email: "",
        password: "",
    },
    validators: {
        onBlur: SignIn,
    },
    onSubmit(props) {
        mutation.mutate(props.value)
    },
})

const mutation = useMutation({
    ...authMutations.signIn(),
    onSuccess(data) {
        client.setQueryData(authQueries.whoami().queryKey, data)
        router.push({ name: HomeRouteName })
    },
    onError: () => {
        form.setErrorMap({
            // email: "Email may be invalid",
            // password: "Password may be invalid",
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
            @submit.prevent.stop="form.handleSubmit">
            <div class="flex flex-col gap-y-3"></div>
            <FieldGroup>
                <form.Field
                    v-slot="{ field }"
                    name="email">
                    <Field :data-invalid="isFieldInvalid(field)">
                        <FieldLabel
                            :html-for="field.name"
                            class="sr-only">
                            Email
                        </FieldLabel>
                        <Input
                            :name="field.name"
                            :model-value="field.state.value"
                            autocomplete="email"
                            placeholder="Enter your email address..."
                            @blur="field.handleBlur"
                            @change="(e) => field.handleChange(e.target.value)" />
                    </Field>
                </form.Field>
            </FieldGroup>

            <!--

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
             -->

            <Button
                :disabled="isLoading"
                type="submit"
                variant="secondary">
                Continue with email
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
