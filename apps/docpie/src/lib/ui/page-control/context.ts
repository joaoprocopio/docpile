import type { InjectionKey, Ref } from "vue"
import { inject } from "vue"

export type PageControlValue = string | number

export interface PageControlContext {
    rootRef: Ref<HTMLElement | null>
    value: Ref<PageControlValue | undefined>
    disabled: Ref<boolean>
    orientation: Ref<"horizontal" | "vertical">
    select(value: PageControlValue): void
}

export const pageControlInjectionKey = Symbol(
    "PageControlContext",
) as InjectionKey<PageControlContext>

export function usePageControlContext() {
    const context = inject(pageControlInjectionKey, null)

    if (!context) {
        throw new Error("Must be used within <PageControl />")
    }

    return context
}
