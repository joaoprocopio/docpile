import { asConst } from "~/lib/enum"

export type TColorMode = (typeof ColorMode)[keyof typeof ColorMode]

export const ColorMode = asConst({
    System: "system",
    Light: "light",
    Dark: "dark",
})
