import { type ComputedRef, inject, type InjectionKey, provide } from "vue"
import { isNil } from "~/utils/is"

export type TOnboarding = {
    steps: AnyArray<string>
    index: ComputedRef<number>
    finishing: ComputedRef<boolean>
    go: (index: number) => void
    next: () => void
    prev: () => void
}

const OnboardingInjectionKey = Symbol() as InjectionKey<TOnboarding>

export function useOnboarding() {
    const onboarding = inject(OnboardingInjectionKey)

    if (isNil(onboarding)) {
        throw new Error()
    }

    return onboarding
}

export function provideOnboarding(onboarding: TOnboarding) {
    provide(OnboardingInjectionKey, onboarding)
}
