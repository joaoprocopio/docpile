<script setup lang="ts">
import { useForm } from "@tanstack/vue-form"
import { useIsMutating, useMutation, useQueryClient } from "@tanstack/vue-query"
import { useDebounceFn } from "@vueuse/core"
import { FetchError } from "ofetch"
import { computed } from "vue"

import { useRouter } from "#app"
import { env } from "~/env"
import { HttpStatus } from "~/lib/http/status"
import { OnboardingRoutes } from "~/lib/router/constants"
import { Button } from "~/lib/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "~/lib/ui/field"
import { Input } from "~/lib/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "~/lib/ui/input-group"
import { Spinner } from "~/lib/ui/spinner"
import { orgMutations, orgQueries } from "~/state/org/query"
import { CreateOrg } from "~/state/org/schemas"
import { isNil } from "~/utils/is"

const client = useQueryClient()
const router = useRouter()

const form = useForm({
    defaultValues: {
        name: "",
        slug: "",
    },
    validators: {
        onSubmit: CreateOrg,
    },
    onSubmit(props) {
        mutation.mutate(props.value)
    },
})
const submit = useDebounceFn(form.handleSubmit)

const mutation = useMutation({
    ...orgMutations.create(),
    onSuccess(data) {
        client.setQueryData(orgQueries.orgs().queryKey, (prevData) => {
            if (!isNil(prevData)) {
                prevData.push(data)
            }

            return prevData
        })
        client.invalidateQueries({ queryKey: orgQueries.all() })
        router.push({ name: OnboardingRoutes.Team, params: { orgSlug: data.slug } })
    },
    onError(err) {
        if (err instanceof FetchError && err.status === HttpStatus.Conflict) {
            form.setErrorMap({
                onSubmit: { fields: { slug: { message: "This URL is already taken" } } },
            })
        }
    },
})

const isMutating = useIsMutating({ mutationKey: orgMutations.create().mutationKey })
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
                        Create organization
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    </div>
</template>
