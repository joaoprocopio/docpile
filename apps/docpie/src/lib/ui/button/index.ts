import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
    "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-md text-xs font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    "bg-primary bg-gradient-highlight text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/80",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-xs shadow-primary-1 hover:bg-destructive/90 focus-visible:ring-destructive/40 active:bg-destructive/80 dark:bg-destructive/60 dark:hover:bg-destructive/65 dark:focus-visible:ring-destructive/40 dark:active:bg-destructive/70",
                secondary:
                    "bg-secondary bg-gradient-highlight-subtle text-secondary-foreground shadow-xs hover:bg-secondary/80 active:bg-secondary/70",
                outline:
                    "border bg-background shadow-xs hover:bg-accent/30 hover:text-accent-foreground active:bg-accent/80 dark:border-input dark:bg-input/30 dark:hover:bg-input/50 dark:active:bg-input/60",
                ghost: "hover:bg-accent/90 text-accent-foreground hover:text-foreground active:bg-accent/80 dark:hover:bg-accent/50 dark:active:bg-accent/70",
                link: "text-link underline-offset-4 hover:underline",
            },
            size: {
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
                xs: "h-7 rounded-md px-2 has-[>svg]:px-2.5",
                icon: "size-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
