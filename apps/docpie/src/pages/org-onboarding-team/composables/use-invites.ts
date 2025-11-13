import { useStorage } from "@vueuse/core"
import { watch } from "vue"

import { CreateInvite, type TCreateInviteIn } from "~/state/org/schemas"

export function useInvites() {
    const invites = useStorage<TCreateInviteIn[]>("onboarding-team-emails", [])

    watch(
        invites,
        ($invites) => {
            const { success } = CreateInvite.array().safeParse($invites)
            if (!success) invites.value = undefined
        },
        { once: true, immediate: true },
    )

    return invites
}
