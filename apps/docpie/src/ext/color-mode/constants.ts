import { asConst } from "~/lib/const"

export type TColorMode = "system" | "light" | "dark"

export const ColorMode = asConst<TColorMode, { title: string }>({
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
