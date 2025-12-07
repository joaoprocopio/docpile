// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"
import * as $compat from "@eslint/compat"
import $prettier from "eslint-config-prettier/flat"
import $path from "path"
import $url from "url"

/** @returns {import("eslint").Linter.Config} */
function vue() {
    return {
        rules: {
            "vue/multi-word-component-names": "off",
            "vue/require-default-prop": "off",
        },
    }
}

/** @returns {import("eslint").Linter.Config} */
function prettier() {
    return $prettier
}

/** @returns {import("eslint").Linter.Config} */
function gitignore() {
    const cwf = $url.fileURLToPath(import.meta.url)
    const cwd = $path.dirname(cwf)
    const gitignore = $path.resolve(cwd, ".gitignore")

    return $compat.includeIgnoreFile(gitignore)
}

export default withNuxt(gitignore(), prettier(), vue())
