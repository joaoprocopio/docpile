import { constEnum } from "~/lib/enum"

export type TColorMode = (typeof ColorMode)[keyof typeof ColorMode]

export const ColorMode = constEnum({
    System: "system",
    Light: "light",
    Dark: "dark",
})
