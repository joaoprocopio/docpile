<script setup lang="ts">
import { useForm } from "@tanstack/vue-form"
import { useDebounceFn, useStorage } from "@vueuse/core"
import { watch } from "vue"

import { AppRoutes } from "~/lib/router/constants"
import { Button, buttonVariants } from "~/lib/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "~/lib/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "~/lib/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/lib/ui/select"
import { CreateInvite, Role, type TCreateInviteOut, type TRole } from "~/state/org/schemas"
import { isEmpty } from "~/utils/is"

const invites = useStorage<TCreateInviteOut[]>("onboarding-team-emails", [])

watch(
    invites,
    ($invites) => {
        const { success } = CreateInvite.array().safeParse($invites)

        if (!success) invites.value = undefined
    },
    { once: true, immediate: true },
)

const form = useForm({
    defaultValues: {
        email: "",
        role: Role.Member as TRole,
    },
    validators: {
        onSubmit: CreateInvite,
    },
    onSubmit(props) {
        const nextInvite = props.value

        if (-1 === invites.value.findIndex((invite) => invite.email === nextInvite.email)) {
            invites.value.push(nextInvite)
        }

        form.reset()
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
            <div class="flex w-full justify-between gap-x-4">
                <form.Field
                    v-slot="{ field }"
                    name="role">
                    <Field
                        v-slot="{ isInvalid }"
                        class="w-fit"
                        :field="field">
                        <FieldLabel
                            :for="field.name"
                            class="sr-only">
                            Role
                        </FieldLabel>

                        <Select
                            :id="field.name"
                            :model-value="field.state.value"
                            :name="field.name"
                            :aria-invalid="isInvalid"
                            @update:model-value="(role) => field.handleChange(role as TRole)">
                            <SelectTrigger
                                :aria-invalid="isInvalid"
                                class="max-w-32">
                                <SelectValue placeholder="Select a role..." />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem
                                    v-for="(role, roleKey) in Role"
                                    :key="role"
                                    :value="role">
                                    {{ roleKey }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
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
            </div>
        </form>

        <div
            v-if="!isEmpty(invites)"
            class="mt-6 px-4">
            <div
                v-for="invite in invites"
                :key="invite.email">
                {{ invite }}
            </div>
        </div>

        <div class="mt-12 flex flex-col items-center gap-y-3">
            <Button
                class="min-w-48"
                variant="secondary"
                :disabled="isEmpty(invites)">
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
