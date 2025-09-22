import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { createTailwindMerge, getDefaultConfig, mergeConfigs } from "tailwind-merge"

const cfg = () =>
    mergeConfigs(getDefaultConfig(), {
        extend: {
            classGroups: {
                "bg-image": [{ bg: [(value: string) => value.startsWith("gradient-")] }],
            },
        },
    })

export const twm = createTailwindMerge(cfg)

export function cn(...inputs: ClassValue[]) {
    return twm(clsx(inputs))
}
