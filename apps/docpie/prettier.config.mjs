/** @type {import("prettier").Config} */
export default {
    arrowParens: "always",
    bracketSameLine: true,
    bracketSpacing: true,
    endOfLine: "lf",
    plugins: ["prettier-plugin-tailwindcss", "@trivago/prettier-plugin-sort-imports"],
    printWidth: 100,
    quoteProps: "consistent",
    semi: false,
    singleAttributePerLine: true,
    singleQuote: false,
    tabWidth: 4,
    tailwindFunctions: ["cva", "cn", "cx", "clsx"],
    tailwindStylesheet: "./src/lib/tailwind/tailwind.css",
    trailingComma: "all",
    useTabs: false,
    vueIndentScriptAndStyle: false,
}
