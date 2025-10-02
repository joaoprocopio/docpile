import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "bg-primary bg-gradient-highlight text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/80",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-primary-1 shadow-xs hover:bg-destructive/90 active:bg-destructive/80 focus-visible:ring-destructive/40",
                secondary:
                    "bg-secondary text-secondary-foreground bg-gradient-highlight-subtle shadow-xs hover:bg-secondary/80 active:bg-secondary/70",
                // dark:bg-input/30 dark:border-input dark:hover:bg-input/50
                outline:
                    "border bg-background shadow-xs hover:text-accent-foreground hover:bg-accent/30 active:bg-accent/80",
                // dark:hover:bg-accent/50
                ghost: "hover:bg-accent/90 active:bg-accent/80 hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
