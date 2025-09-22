import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { createTailwindMerge, getDefaultConfig, mergeConfigs } from "tailwind-merge"

console.log("prev", getDefaultConfig().classGroups["bg-image"])

const cfg = () =>
    mergeConfigs(getDefaultConfig(), {
        extend: {
            classGroups: {
                "bg-image": [{ bg: [(value: string) => value.startsWith("gradient-")] }],
            },
        },
    })

console.log("next", cfg().classGroups["bg-image"])

export const twm = createTailwindMerge(cfg)

export function cn(...inputs: ClassValue[]) {
    return twm(clsx(inputs))
}
