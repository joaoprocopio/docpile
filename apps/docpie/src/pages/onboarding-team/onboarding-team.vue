<script setup lang="ts">
import { useForm } from "@tanstack/vue-form"
import { useDebounceFn } from "@vueuse/core"
import { z } from "zod/v4"

import { AppRoutes } from "~/lib/router/constants"
import { Button, buttonVariants } from "~/lib/ui/button"
import { Field, FieldError, FieldLabel } from "~/lib/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "~/lib/ui/input-group"
import { Email } from "~/state/auth/schemas"

const AddEmail = z.object({
    email: Email,
})

const form = useForm({
    defaultValues: {
        email: "",
    },
    validators: {
        onSubmit: AddEmail,
    },
    onSubmit(props) {
        console.log("Invite email:", props.value)
    },
})
const submit = useDebounceFn(form.handleSubmit)
</script>

<template>
    <div>
        <div class="space-y-1.5 text-center">
            <h1 class="text-2xl font-semibold">Invite people to your team</h1>
            <h2 class="text-xs text-muted-foreground">
                Docpie is designed around collaborative work. You can invite people now or any time.
            </h2>
        </div>

        <form
            class="mt-8"
            @submit.prevent.stop="submit">
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

                    <InputGroup>
                        <InputGroupInput
                            :id="field.name"
                            :name="field.name"
                            :aria-invalid="isInvalid"
                            :model-value="field.state.value"
                            placeholder="example@domain.com"
                            @blur="field.handleBlur"
                            @change="
                                (e: Event) =>
                                    field.handleChange((e.target as HTMLInputElement).value)
                            " />

                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                type="submit"
                                variant="secondary">
                                <span>Add</span>
                                <Icon
                                    name="lucide:plus"
                                    class="size-3.5" />
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>

                    <FieldError
                        v-if="isInvalid"
                        :errors="field.state.meta.errors" />
                </Field>
            </form.Field>
        </form>

        <div class="mt-12 flex flex-col items-center gap-y-3">
            <Button
                class="min-w-48"
                variant="secondary">
                Send invites
            </Button>

            <RouterLink
                :class="
                    buttonVariants({
                        class: 'text-muted-foreground',
                        variant: 'ghost',
                    })
                "
                :to="{ name: AppRoutes.Home }">
                I'll do it later
            </RouterLink>
        </div>
    </div>
</template>
