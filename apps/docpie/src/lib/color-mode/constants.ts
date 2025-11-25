import { constEnum } from "~/lib/const"

export type TColorMode = "system" | "light" | "dark"

export const ColorMode = constEnum<TColorMode, { title: string }>({
    system: {
        value: "system",
        title: "System",
    },
    light: {
        value: "light",
        title: "Light",
    },
    dark: {
        value: "dark",
        title: "Dark",
    },
})
