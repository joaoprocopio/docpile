<script setup lang="ts">
import { useClipboard } from "@vueuse/core"
import { computed } from "vue"

import { Button } from "~/lib/ui/button"
import { Field, FieldDescription, FieldLabel } from "~/lib/ui/field"
import { InputGroup, InputGroupButton, InputGroupInput } from "~/lib/ui/input-group"
import { sonner } from "~/lib/ui/sonner"
import { useOnboarding } from "~/state/org/composables"

const onboarding = useOnboarding()

// TODO: Replace with actual invite link from backend
const inviteLink = computed(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    return `${baseUrl}/invite/org-123-invite-token`
})

const { copy, copied } = useClipboard()

async function handleCopy() {
    await copy(inviteLink.value)
    sonner.success("Invite link copied to clipboard!")
}
</script>

<template>
    <div>
        <div class="space-y-1.5 text-center">
            <h1 class="text-2xl font-semibold">Invite people to your organization</h1>
            <h2 class="text-xs text-muted-foreground">
                Docpie is designed around collaborative work. You can invite people now or at any
                time.
            </h2>
        </div>

        <div class="mt-8">
            <div class="space-y-4">
                <Field>
                    <InputGroup class="h-auto">
                        <InputGroupInput
                            :model-value="inviteLink"
                            readonly
                            class="text-xs" />
                        <InputGroupButton
                            size="sm"
                            variant="ghost"
                            class="shrink-0"
                            @click="handleCopy">
                            <Icon
                                :name="copied ? 'lucide:check' : 'lucide:copy'"
                                class="size-4" />
                            <span class="sr-only">Copy invite link</span>
                        </InputGroupButton>
                    </InputGroup>

                    <FieldDescription>
                        Share this link with people you want to join your organization
                    </FieldDescription>
                </Field>
            </div>
        </div>

        <div class="mt-12 flex flex-col items-center gap-y-3">
            <Button
                class="min-w-48"
                variant="secondary"
                @click="() => onboarding.next()">
                Continue
            </Button>
        </div>
    </div>
</template>
