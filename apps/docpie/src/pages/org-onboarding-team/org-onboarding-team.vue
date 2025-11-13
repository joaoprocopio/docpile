<script setup lang="ts">
import { useForm } from "@tanstack/vue-form"
import { useDebounceFn, useStorage } from "@vueuse/core"
import { computed, watch } from "vue"

import { OrgRoutes } from "~/lib/router/constants"
import { Button, buttonVariants } from "~/lib/ui/button"
import { ButtonGroup } from "~/lib/ui/button-group"
import { Field, FieldError } from "~/lib/ui/field"
import { Input } from "~/lib/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/lib/ui/select"
import { CreateInvite, Role, type TCreateInviteOut, type TRole } from "~/state/org/schemas"
import { isArray, isEmpty } from "~/utils/is"

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
        role: Role.Member satisfies TRole as TRole,
    },
    validators: {
        onSubmit: CreateInvite,
    },
    onSubmit(props) {
        const nextInvite = props.value
        const nextInviteIndex = invites.value.findIndex(
            (invite) => invite.email === nextInvite.email,
        )

        if (nextInviteIndex === -1) {
            invites.value.push(nextInvite)
        } else {
            form.setErrorMap({
                onSubmit: { fields: { email: { message: "This URL is already taken" } } },
            })
        }

        form.reset()
    },
})
const submit = useDebounceFn(form.handleSubmit)
const fields = {
    email: form.useStore((state) => state.fieldMeta.email),
    role: form.useStore((state) => state.fieldMeta.role),
}
const errors = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errors: any[] = []

    console.log("vai", fields.role)
    if (isArray(fields.email.value?.errors)) {
        errors = errors.concat(fields.email.value.errors)
    }

    if (isArray(fields.role.value?.errors)) {
        errors = errors.concat(fields.role.value.errors)
    }

    return errors
})
const hasError = computed(() => isArray(errors.value) && !isEmpty(errors.value))
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
            <Field>
                <ButtonGroup>
                    <ButtonGroup>
                        <form.Field
                            v-slot="{ field }"
                            name="role">
                            <Select
                                :id="field.name"
                                :model-value="field.state.value"
                                :name="field.name"
                                @update:model-value="(role) => field.handleChange(role as TRole)">
                                <SelectTrigger :aria-invalid="hasError">
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
                        </form.Field>

                        <form.Field
                            v-slot="{ field }"
                            name="email">
                            <Input
                                :id="field.name"
                                :name="field.name"
                                :model-value="field.state.value"
                                :aria-invalid="hasError"
                                placeholder="example@domain.com"
                                @blur="field.handleBlur"
                                @change="
                                    (e: Event) =>
                                        field.handleChange((e.target as HTMLInputElement).value)
                                " />
                        </form.Field>
                    </ButtonGroup>

                    <ButtonGroup>
                        <Button
                            type="submit"
                            aria-label="Send"
                            class="size-9"
                            size="icon"
                            variant="outline">
                            <Icon
                                name="lucide:plus"
                                class="size-4" />
                        </Button>
                    </ButtonGroup>
                </ButtonGroup>

                <FieldError
                    v-if="hasError"
                    :errors="errors" />
            </Field>
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
                :to="{ name: OrgRoutes.Home }">
                I'll do it later
            </RouterLink>
        </div>
    </div>
</template>
