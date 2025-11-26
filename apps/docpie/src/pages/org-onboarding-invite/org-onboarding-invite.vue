<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query"
import { useClipboard } from "@vueuse/core"
import { computed } from "vue"
import { useRouter } from "vue-router"

import { useRoute } from "#app"
import { env } from "~/env"
import { InviteRoute } from "~/lib/router/constants"
import { Button } from "~/lib/ui/button"
import { Field, FieldContent, FieldDescription, FieldLabel } from "~/lib/ui/field"
import { InputGroup, InputGroupButton, InputGroupInput } from "~/lib/ui/input-group"
import { sonner } from "~/lib/ui/sonner"
import { orgCache } from "~/state/org/cache"
import { useOnboarding } from "~/state/org/composables"

const onboarding = useOnboarding()
const clipboard = useClipboard()
const router = useRouter()
const route = useRoute()

const slug = computed(() => route.params.slug as string)

const inviteToken = useQuery(orgCache.queries.inviteToken({ orgSlug: slug.value }))
const rotateInviteToken = useMutation(orgCache.mutations.rotateInviteToken())

const inviteLink = computed(() => {
    const resolved = router.resolve({
        name: InviteRoute,
        params: { token: inviteToken.data.value },
    })

    return env.BASE_URL.origin + resolved.path
})

async function handleCopy() {
    await clipboard.copy(inviteLink.value)
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
            <Field orientation="vertical">
                <FieldContent>
                    <FieldLabel>Invite link</FieldLabel>

                    <FieldDescription>
                        Share this link with people you want to join your organization. You can
                        <Button
                            variant="link"
                            class="h-fit p-0 text-2xs"
                            @click="() => rotateInviteToken.mutate({ orgSlug: slug })"
                            >generate a new link</Button
                        >
                        too.
                    </FieldDescription>
                </FieldContent>

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
                            :name="clipboard.copied.value ? 'lucide:check' : 'lucide:copy'"
                            class="size-4" />
                        <span class="sr-only">Copy invite link</span>
                    </InputGroupButton>
                </InputGroup>
            </Field>
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
