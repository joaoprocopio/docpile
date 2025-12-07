<script setup lang="ts">
import { SignUp } from "#shared/auth/schemas"
import { HttpStatus } from "#shared/utils/http-status"
import { useForm } from "@tanstack/vue-form"
import { useDebounceFn, useToggle } from "@vueuse/core"
import { computed } from "vue"
import { useIsMutating, useMutation } from "~/lib/cache"
import { FetchError } from "~/lib/http"
import { AuthRoutes } from "~/lib/router/constants"
import { Button } from "~/lib/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "~/lib/ui/field"
import { Input } from "~/lib/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/lib/ui/input-group"
import { Spinner } from "~/lib/ui/spinner"
import { authCache } from "~/state/auth/cache"

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
        mutation.mutate({ payload: props.value })
    },
})
const submit = useDebounceFn(form.handleSubmit)

const mutation = useMutation({
    ...authCache.mutations.signup(),
    onError: (err) => {
        if (err instanceof FetchError && err.status === HttpStatus.Conflict) {
            form.setErrorMap({
                onSubmit: { fields: { email: { message: "This email is already taken" } } },
            })
        }
    },
})

const isMutating = useIsMutating({ mutationKey: authCache.keys.mutations.signup() })
const isLoading = computed(() => Boolean(isMutating.value))

const [showPassword, toggleShowPassword] = useToggle(false)
</script>

<template>
    <div class="flex flex-col items-center">
        <h1 class="text-xl font-semibold">Sign up to Docpie</h1>

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
                                        class="size-4.5"
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
                <template v-else> Continue with email </template>
            </Button>
        </form>

        <p
            class="mt-8 flex flex-col items-center gap-x-1 text-center text-2xs text-muted-foreground xs:flex-row">
            <span> Already have an account? </span>
            <NuxtLink
                :to="{ name: AuthRoutes.SignIn.value }"
                class="font-semibold text-foreground">
                Sign in
            </NuxtLink>
        </p>
    </div>
</template>
