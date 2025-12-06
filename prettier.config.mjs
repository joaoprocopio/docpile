/** @type {import("prettier").Config} */
export default {
    arrowParens: "always",
    bracketSameLine: true,
    bracketSpacing: true,
    endOfLine: "lf",
    printWidth: 100,
    quoteProps: "consistent",
    semi: false,
    singleAttributePerLine: true,
    singleQuote: false,
    tabWidth: 4,
    trailingComma: "all",
    useTabs: false,
    vueIndentScriptAndStyle: false,
    plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
    tailwindFunctions: ["cva", "cn", "cx", "clsx"],
    tailwindStylesheet: "./src/lib/tailwind/tailwind.css",
}
