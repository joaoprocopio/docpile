<script setup lang="ts">
import { useForm } from "@tanstack/vue-form"
import { useDebounceFn } from "@vueuse/core"
import { computed } from "vue"

import { env } from "~/env"
import { rerunMiddleware } from "~/ext/vue-router/utils"
import { useIsMutating, useMutation, useQueryClient } from "~/lib/cache"
import { HttpStatus } from "~/lib/http/status"
import { Button } from "~/lib/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "~/lib/ui/field"
import { Input } from "~/lib/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "~/lib/ui/input-group"
import { Spinner } from "~/lib/ui/spinner"
import { orgCache } from "~/state/org/cache"
import { CreateOrg } from "~/state/org/schemas"
import { isNetworkError, isNil } from "~/utils/is"

const client = useQueryClient()

const form = useForm({
    defaultValues: {
        name: "",
        slug: "",
    },
    validators: {
        onSubmit: CreateOrg,
    },
    onSubmit(props) {
        mutation.mutate({ payload: props.value })
    },
})
const submit = useDebounceFn(form.handleSubmit)

const mutation = useMutation({
    ...orgCache.mutations.create(),
    onSuccess(data) {
        client.setQueryData(orgCache.queries.list().queryKey, (prevData) => {
            if (!isNil(prevData)) {
                prevData.push(data)
            }

            return prevData
        })
        client.invalidateQueries({ queryKey: orgCache.keys.queries.all() })
        rerunMiddleware()
    },
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
                                <InputGroupText>{{ env.HOST + "/" }}</InputGroupText>
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
