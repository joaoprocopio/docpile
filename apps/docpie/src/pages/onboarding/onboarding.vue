<script setup lang="ts">
import { useForm } from "@tanstack/vue-form"
import { useDebounceFn } from "@vueuse/core"

import { Button } from "~/lib/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "~/lib/ui/field"
import { Input } from "~/lib/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/lib/ui/input-group"
import { CreateOrg } from "~/state/org/schemas"

const form = useForm({
    defaultValues: {
        name: "",
        slug: "",
    },
    validators: {
        onSubmit: CreateOrg,
    },
})
const submit = useDebounceFn(form.handleSubmit)
</script>

<template>
    <div>
        <div class="text-center">
            <h1 class="text-2xl font-semibold">Create an organization</h1>
            <h2 class="mt-1 text-sm text-muted-foreground">
                Organizations holds teams and documentations
            </h2>
        </div>

        <form
            class="mt-8 flex flex-col gap-y-12"
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
            </FieldGroup>

            <Button type="submit">Create organization</Button>
        </form>
    </div>
</template>
