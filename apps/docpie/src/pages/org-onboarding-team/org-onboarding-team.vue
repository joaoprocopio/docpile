<script setup lang="ts">
import { type StandardSchemaV1Issue, useForm } from "@tanstack/vue-form"
import { useDebounceFn } from "@vueuse/core"
import { computed } from "vue"

import { Avatar, AvatarFallback } from "~/lib/ui/avatar"
import { Button } from "~/lib/ui/button"
import { Field, FieldDescription, FieldError } from "~/lib/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
    InputGroupTextarea,
} from "~/lib/ui/input-group"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
} from "~/lib/ui/item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/lib/ui/select"
import { Separator } from "~/lib/ui/separator"
import { useInvites } from "~/state/org/composables"
import { CreateInviteMultiline, Role, type TCreateInviteIn, type TRole } from "~/state/org/schemas"
import { composeInitials } from "~/utils/avatar"
import { isArray, isEmpty, isNil } from "~/utils/is"
import { hasOwnProperty } from "~/utils/obj"

const invites = useInvites()

const defaultValues: TCreateInviteIn = {
    email: "",
    role: Role.member.value,
}

const form = useForm({
    defaultValues: defaultValues,
    validators: {
        onSubmit: CreateInviteMultiline,
    },
    onSubmit(props) {
        const seenEmails = Object.fromEntries(
            invites.value.map((invite, index) => [invite.email, index]),
        )
        const nextInvites = CreateInviteMultiline.parse(props.value)

        for (const invite of nextInvites) {
            const emailIndex = seenEmails[invite.email]

            if (isNil(emailIndex)) {
                invites.value.push(invite)
            } else {
                invites.value[emailIndex] = invite
            }
        }

        form.resetField("email")
    },
})
const submit = useDebounceFn(form.handleSubmit)

const formErrors = form.useStore((state) => state.errors)
const errors = computed(() => {
    let $errors: StandardSchemaV1Issue[] = []

    for (const errorMap of formErrors.value) {
        for (const key in errorMap) {
            if (!hasOwnProperty(errorMap, key)) {
                continue
            }

            const errors = errorMap[key]

            if (isNil(errors)) {
                continue
            }

            $errors = $errors.concat(errors)
        }
    }

    return $errors
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
                            placeholder="example@domain.com"
                            @blur="field.handleBlur"
                            @input="
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
                                        v-for="role in Role"
                                        :key="role.value"
                                        :value="role.value">
                                        {{ role.title }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </form.Field>

                        <InputGroupText class="ml-auto">
                            <template v-if="!isEmpty(invites)">
                                <span v-if="invites.length === 1">
                                    {{ invites.length }} invite
                                </span>
                                <span v-else-if="invites.length > 1">
                                    {{ invites.length }} invites
                                </span>

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

        <ItemGroup
            v-if="!isEmpty(invites)"
            class="mt-6">
            <template
                v-for="(invite, inviteIndex) in invites"
                :key="invite.email">
                <Item class="px-0">
                    <ItemMedia>
                        <Avatar>
                            <AvatarFallback>
                                {{ composeInitials(invite.email) }}
                            </AvatarFallback>
                        </Avatar>
                    </ItemMedia>

                    <ItemContent>
                        <ItemTitle>
                            {{ invite.email }}
                        </ItemTitle>
                        <ItemDescription>
                            {{ Role[invite.role].title }}
                        </ItemDescription>
                    </ItemContent>

                    <ItemActions>
                        <Button
                            size="icon"
                            variant="ghost"
                            class="rounded-full"
                            @click="() => invites.splice(inviteIndex, 1)">
                            <Icon name="lucide:x" />
                        </Button>
                    </ItemActions>
                </Item>

                <ItemSeparator v-if="inviteIndex !== invites.length - 1" />
            </template>
        </ItemGroup>

        <div class="mt-12 flex flex-col items-center gap-y-3">
            <Button
                class="min-w-48"
                variant="secondary"
                :disabled="isEmpty(invites)">
                Send invites
            </Button>

            <Button
                class="text-muted-foreground"
                variant="ghost">
                I'll do it later
            </Button>
        </div>
    </div>
</template>
