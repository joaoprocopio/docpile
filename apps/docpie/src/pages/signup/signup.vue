<script setup lang="ts">
import { useForm } from "@tanstack/vue-form"
import { useIsMutating, useMutation, useQueryClient } from "@tanstack/vue-query"
import { useDebounceFn, useToggle } from "@vueuse/core"
import { FetchError } from "ofetch"
import { computed } from "vue"

import { useRouter } from "#app"
import { HttpStatus } from "~/lib/http/status"
import { AppRoutes, AuthRoutes } from "~/lib/router/constants"
import { Button } from "~/lib/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "~/lib/ui/field"
import { Input } from "~/lib/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/lib/ui/input-group"
import { Spinner } from "~/lib/ui/spinner"
import { authMutations, authQueries } from "~/state/auth/query"
import { SignUp } from "~/state/auth/schemas"
import { orgQueries } from "~/state/org/query"

const client = useQueryClient()
const router = useRouter()

const form = useForm({
    defaultValues: {
        display_name: "",
        email: "",
        password: "",
    },
    validators: {
        onSubmit: SignUp,
    },
    onSubmit(props) {
        mutation.mutate(props.value)
    },
})
const submit = useDebounceFn(form.handleSubmit)

const mutation = useMutation({
    ...authMutations.signUp(),
    onSuccess(data) {
        client.setQueryData(authQueries.whoami().queryKey, data)
        client.prefetchQuery(orgQueries.orgs())
        router.push({ name: AppRoutes.Home })
    },
    onError: (err) => {
        if (err instanceof FetchError && err.status === HttpStatus.Conflict) {
            form.setErrorMap({
                onSubmit: { fields: { email: { message: "This email is already taken" } } },
            })
        }
    },
})

const isMutating = useIsMutating({ mutationKey: authMutations.signIn().mutationKey })
const isLoading = computed(() => Boolean(isMutating.value))

const [showPassword, toggleShowPassword] = useToggle(false)
</script>

<template>
    <div class="flex flex-col items-center">
        <h1 class="text-lg font-semibold">Sign up to Docpie</h1>

        <form
            class="mt-8 flex w-full flex-col gap-y-5"
            @submit.prevent.stop="submit">
            <FieldGroup class="gap-3">
                <form.Field
                    v-slot="{ field }"
                    name="display_name">
                    <Field
                        v-slot="{ isInvalid }"
                        :field="field">
                        <FieldLabel
                            :for="field.name"
                            class="sr-only">
                            Name
                        </FieldLabel>

                        <Input
                            :id="field.name"
                            :name="field.name"
                            :aria-invalid="isInvalid"
                            :model-value="field.state.value"
                            placeholder="Enter your name..."
                            @blur="field.handleBlur"
                            @change="
                                (e: Event) =>
                                    field.handleChange((e.target as HTMLInputElement).value)
                            " />

                        <FieldError
                            v-if="isInvalid"
                            :errors="field.state.meta.errors" />
                        <FieldDescription v-else>
                            This name will be displayed to other users
                        </FieldDescription>
                    </Field>
                </form.Field>

                <form.Field
                    v-slot="{ field }"
                    name="email">
                    <Field
                        v-slot="{ isInvalid }"
                        :field="field">
                        <FieldLabel
                            :for="field.name"
                            class="sr-only">
                            Email
                        </FieldLabel>

                        <Input
                            :id="field.name"
                            :name="field.name"
                            :aria-invalid="isInvalid"
                            :model-value="field.state.value"
                            placeholder="Enter your email address..."
                            @blur="field.handleBlur"
                            @change="
                                (e: Event) =>
                                    field.handleChange((e.target as HTMLInputElement).value)
                            " />

                        <FieldError
                            v-if="isInvalid"
                            :errors="field.state.meta.errors" />
                    </Field>
                </form.Field>

                <form.Field
                    v-slot="{ field }"
                    name="password">
                    <Field
                        v-slot="{ isInvalid }"
                        :field="field">
                        <FieldLabel
                            :for="field.name"
                            class="sr-only">
                            Password
                        </FieldLabel>

                        <InputGroup>
                            <InputGroupInput
                                :id="field.name"
                                :name="field.name"
                                :aria-invalid="isInvalid"
                                :model-value="field.state.value"
                                :type="showPassword ? 'text' : 'password'"
                                autocomplete="current-password"
                                placeholder="Enter your password..."
                                @blur="field.handleBlur"
                                @change="
                                    (e: Event) =>
                                        field.handleChange((e.target as HTMLInputElement).value)
                                " />

                            <InputGroupAddon align="inline-end">
                                <Button
                                    class="size-auto p-1"
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    @click="() => toggleShowPassword()">
                                    <Icon
                                        class="size-[1.125rem]"
                                        :name="showPassword ? 'lucide:eye' : 'lucide:eye-off'" />
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>

                        <FieldError
                            v-if="isInvalid"
                            :errors="field.state.meta.errors" />
                    </Field>
                </form.Field>
            </FieldGroup>

            <Button
                :disabled="isLoading"
                type="submit"
                variant="secondary">
                <Spinner v-if="isLoading" />
                Continue with email
            </Button>
        </form>

        <p
            class="mt-8 flex flex-col items-center gap-x-1 text-center text-2xs text-muted-foreground xs:flex-row">
            <span> Already have an account? </span>
            <NuxtLink
                :to="{ name: AuthRoutes.SignIn }"
                class="font-semibold text-foreground">
                Sign in
            </NuxtLink>
        </p>
    </div>
</template>
