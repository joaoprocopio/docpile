import config from "prettier-config"

/** @type {import("prettier").Config} */
export default {
    ...config,
    plugins: ["prettier-plugin-tailwindcss"],
    tailwindFunctions: ["cva", "cn", "cx", "clsx"],
    tailwindStylesheet: "./src/assets/tailwind.css",
}
