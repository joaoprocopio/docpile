import { z } from "zod/v4"

export const OrgStatus = {
    Active: "active",
} as const

export const Org = z.object({
    name: z.string().nonempty().max(64),
    status: z.enum(OrgStatus),
})

export type TOrgIn = z.input<typeof Org>
export type TOrgOut = z.output<typeof Org>
