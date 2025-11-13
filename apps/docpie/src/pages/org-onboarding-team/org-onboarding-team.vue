<script setup lang="ts">
import { type StandardSchemaV1Issue, useForm } from "@tanstack/vue-form"
import { useDebounceFn } from "@vueuse/core"
import { computed } from "vue"

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
import { useInvites } from "~/pages/org-onboarding-team/composables/use-invites"
import {
    CreateInvite,
    CreateInviteMultiline,
    Role,
    type TCreateInviteIn,
    type TRole,
} from "~/state/org/schemas"
import { isArray, isEmpty, isInteger, isNil } from "~/utils/is"
import { hasOwnProperty } from "~/utils/obj"

const invites = useInvites()

const defaultValues: TCreateInviteIn = {
    email: "",
    role: Role.Member,
}

const form = useForm({
    defaultValues: defaultValues,
    validators: {
        onSubmit: CreateInvite,
    },
    onSubmit(props) {
        const seenEmails = Object.fromEntries(
            invites.value.map((invite, index) => [invite.email, index]),
        )
        const nextInvites = CreateInviteMultiline.parse(props.value)

        for (const invite of nextInvites) {
            const emailIndex = seenEmails[invite.email]

            if (isInteger(emailIndex)) {
                invites.value[emailIndex] = invite
            } else {
                invites.value.push(invite)
            }
        }

        form.resetField("email")
    },
})
const submit = useDebounceFn(form.handleSubmit)

const formErrors = form.useStore((state) => state.errors)
const errors = computed(() => {
    let temp: StandardSchemaV1Issue[] = []

    for (const errorMap of formErrors.value) {
        for (const key in errorMap) {
            if (!hasOwnProperty(errorMap, key)) {
                continue
            }

            const errors = errorMap[key]

            if (isNil(errors)) {
                continue
            }

            temp = temp.concat(errors)
        }
    }

    return temp
})
const hasErrors = computed(() => isArray(errors.value) && !isEmpty(errors.value))
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
                <InputGroup :aria-invalid="hasErrors">
                    <form.Field
                        v-slot="{ field }"
                        name="email">
                        <InputGroupTextarea
                            :id="field.name"
                            :name="field.name"
                            :model-value="field.state.value"
                            :aria-invalid="hasErrors"
                            autocomplete="email"
                            placeholder="john@example.com&#10;sara@example.com&#10;nate@example.com"
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

                        <InputGroupText class="ml-auto">
                            <template v-if="invites.length > 1">
                                <span> {{ invites.length }} invites </span>

                                <Separator
                                    class="h-5!"
                                    orientation="vertical" />
                            </template>
                        </InputGroupText>

                        <InputGroupButton
                            type="submit"
                            variant="outline"
                            class="rounded-full"
                            size="icon-sm">
                            <Icon name="lucide:plus" />
                            <span className="sr-only">Add</span>
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>

                <FieldDescription v-if="!hasErrors">
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
