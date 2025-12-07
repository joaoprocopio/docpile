<script setup lang="ts">
import { env } from "#shared/env"
import { CreateOrgInput } from "#shared/org/schemas"
import { HttpStatus } from "#shared/utils/http-status"
import { isNetworkError } from "#shared/utils/is"
import { useForm } from "@tanstack/vue-form"
import { useDebounceFn } from "@vueuse/core"
import { computed } from "vue"
import { useIsMutating, useMutation } from "~/lib/cache"
import { Button } from "~/lib/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "~/lib/ui/field"
import { Input } from "~/lib/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "~/lib/ui/input-group"
import { Spinner } from "~/lib/ui/spinner"
import { orgCache } from "~/state/org/cache"

const form = useForm({
    defaultValues: {
        name: "",
        slug: "",
    },
    validators: {
        onSubmit: CreateOrgInput,
    },
    onSubmit(props) {
        mutation.mutate({ payload: props.value })
    },
})
const submit = useDebounceFn(form.handleSubmit)

const mutation = useMutation({
    ...orgCache.mutations.create(),
    onError(err) {
        if (isNetworkError(err) && err.status === HttpStatus.Conflict) {
            form.setErrorMap({
                onSubmit: { fields: { slug: { message: "This URL is already taken" } } },
            })
        }
    },
})

const isMutating = useIsMutating({ mutationKey: orgCache.keys.mutations.create() })
const isLoading = computed(() => Boolean(isMutating.value))
</script>

<template>
    <div>
        <div class="space-y-1.5 text-center">
            <h1 class="text-2xl font-semibold">Create an organization</h1>
            <h2 class="text-xs text-muted-foreground">
                Organizations holds teams and documentations.
            </h2>
        </div>

        <form
            class="mt-8"
            @submit.prevent.stop="submit">
            <FieldGroup>
                <form.Field
                    v-slot="{ field }"
                    name="name">
                    <Field
                        v-slot="{ isInvalid }"
                        :field="field">
                        <FieldLabel :for="field.name">Organization name</FieldLabel>

                        <Input
                            :id="field.name"
                            :name="field.name"
                            :aria-invalid="isInvalid"
                            :model-value="field.state.value"
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
                    name="slug">
                    <Field
                        v-slot="{ isInvalid }"
                        :field="field">
                        <FieldLabel :for="field.name">Organization URL</FieldLabel>

                        <InputGroup>
                            <InputGroupInput
                                :id="field.name"
                                :name="field.name"
                                :aria-invalid="isInvalid"
                                :model-value="field.state.value"
                                @blur="field.handleBlur"
                                @change="
                                    (e: Event) =>
                                        field.handleChange((e.target as HTMLInputElement).value)
                                " />

                            <InputGroupAddon>
                                <InputGroupText>{{ env.BASE_URL.host + "/" }}</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>

                        <FieldError
                            v-if="isInvalid"
                            :errors="field.state.meta.errors" />
                    </Field>
                </form.Field>

                <Field>
                    <Button
                        :disabled="isLoading"
                        type="submit"
                        variant="secondary">
                        <Spinner v-if="isLoading" />
                        <template v-else> Create organization </template>
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    </div>
</template>
