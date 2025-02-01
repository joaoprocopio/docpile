/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: false,
  bracketSameLine: true,
  vueIndentScriptAndStyle: true,
  trailingComma: "all",
  quoteProps: "consistent",
  printWidth: 100,
  plugins: ["prettier-plugin-tailwindcss"],
}

export default config
