import { z } from "zod/v3"

export type TIdentifyIn = z.input<typeof Identify>
export type TIdentifyOut = z.output<typeof Identify>

export const Identify = z.object({
    email: z
        .string({ message: "Please enter a email address" })
        .email({ message: "Please enter a valid email address" }),
})
