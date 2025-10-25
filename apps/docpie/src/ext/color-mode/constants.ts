export type TColorMode = (typeof ColorMode)[keyof typeof ColorMode]

export const ColorMode = {
    System: "system",
    Light: "light",
    Dark: "dark",
} as const
