<script setup lang="ts">
import { useForm } from "@tanstack/vue-form"
import { useDebounceFn, useStorage } from "@vueuse/core"
import { computed, watch } from "vue"

import { OrgRoutes } from "~/lib/router/constants"
import { Button, buttonVariants } from "~/lib/ui/button"
import { Field, FieldDescription, FieldError } from "~/lib/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
    InputGroupTextarea,
} from "~/lib/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/lib/ui/select"
import { Separator } from "~/lib/ui/separator"
import {
    CreateInvite,
    CreateInviteMultiline,
    Role,
    type TCreateInviteIn,
    type TCreateInviteMultilineIn,
    type TRole,
} from "~/state/org/schemas"
import { isArray, isEmpty } from "~/utils/is"

const invites = useStorage<TCreateInviteIn[]>("onboarding-team-emails", [])

const defaultValues: TCreateInviteMultilineIn = {
    emails: "",
    role: Role.Member,
}

const form = useForm({
    defaultValues: defaultValues,
    validators: {
        onSubmit: CreateInviteMultiline,
    },
    onSubmit(props) {
        const prevMails = new Set(invites.value.map((invite) => invite.email))
        const nextInvites = CreateInviteMultiline.parse(props.value)
        const tempInvites: TCreateInviteIn[] = []

        for (const email of nextInvites.emails) {
        }

        // for (const email of invites.email) {
        // }
        // const nextInvite = props.value
        // const nextInviteIndex = invites.value.findIndex(
        //     (invite) => invite.email === nextInvite.email,
        // )
        // if (nextInviteIndex === -1) {
        //     invites.value.push(nextInvite)
        // } else {
        //     form.setErrorMap({
        //         onSubmit: { fields: { email: { message: "This URL is already taken" } } },
        //     })
        // }
        // form.resetField("email")
    },
})
const submit = useDebounceFn(form.handleSubmit)
const fields = {
    emails: form.useStore((state) => state.fieldMeta.emails),
    role: form.useStore((state) => state.fieldMeta.role),
}
const errors = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errors: any[] = []

    if (isArray(fields.emails.value?.errors)) {
        errors = errors.concat(fields.emails.value.errors)
    }

    if (isArray(fields.role.value?.errors)) {
        errors = errors.concat(fields.role.value.errors)
    }

    return errors
})
const hasError = computed(() => isArray(errors.value) && !isEmpty(errors.value))

watch(
    invites,
    ($invites) => {
        const { success } = CreateInvite.array().safeParse($invites)
        if (!success) invites.value = undefined
    },
    { once: true, immediate: true },
)
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
                <InputGroup :aria-invalid="hasError">
                    <form.Field
                        v-slot="{ field }"
                        name="emails">
                        <InputGroupTextarea
                            :id="field.name"
                            :name="field.name"
                            :model-value="field.state.value"
                            :aria-invalid="hasError"
                            autocomplete="email"
                            placeholder="example@domain.com"
                            @blur="field.handleBlur"
                            @change="
                                (e: Event) =>
                                    field.handleChange((e.target as HTMLInputElement).value)
                            "
                            @keydown.ctrl.enter.prevent="submit"
                            @keydown.meta.enter.prevent="submit" />
                    </form.Field>

                    <InputGroupAddon align="block-end">
                        <form.Field
                            v-slot="{ field }"
                            name="role">
                            <Select
                                :id="field.name"
                                :model-value="field.state.value"
                                :name="field.name"
                                @update:model-value="(role) => field.handleChange(role as TRole)">
                                <SelectTrigger
                                    class="shadow-none"
                                    size="sm">
                                    <SelectValue
                                        class="text-xs"
                                        placeholder="Select a role..." />
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

                        <div class="ml-auto">
                            <InputGroupText v-show="invites.length > 1">
                                <span> {{ invites.length }} invites </span>

                                <Separator
                                    class="h-5!"
                                    orientation="vertical" />
                            </InputGroupText>

                            <InputGroupButton
                                type="submit"
                                variant="outline"
                                class="rounded-full"
                                size="icon-sm">
                                <Icon name="lucide:plus" />
                                <span className="sr-only">Add</span>
                            </InputGroupButton>
                        </div>
                    </InputGroupAddon>
                </InputGroup>

                <FieldDescription v-if="!hasError">
                    Enter one email per line to invite multiple people with this role
                </FieldDescription>

                <FieldError
                    v-else
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
