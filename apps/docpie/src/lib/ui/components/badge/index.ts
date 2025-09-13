import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Badge } from "./Badge.vue"

export const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error transition-[color,box-shadow] overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-accent text-accent-foreground [a&]:hover:bg-accent/90",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
                error:
                    "border-transparent bg-error text-white [a&]:hover:bg-error/90 focus-visible:ring-error/20 dark:focus-visible:ring-error/40 dark:bg-error/60",
                outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
