// @ts-check
import * as $compat from "@eslint/compat"
import $prettier from "eslint-config-prettier/flat"
import $sort from "eslint-plugin-simple-import-sort"
import $path from "path"
import $url from "url"

import withNuxt from "./.nuxt/eslint.config.mjs"

/** @returns {import("eslint").Linter.Config} */
function vue() {
    return {
        rules: {
            "vue/multi-word-component-names": "off",
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
    const gitignore = $path.resolve(cwd, "..", "..", ".gitignore")

    return $compat.includeIgnoreFile(gitignore)
}

/** @returns {import("eslint").Linter.Config} */
function sort() {
    return {
        plugins: {
            "simple-import-sort": $sort,
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    }
}

export default withNuxt(gitignore(), prettier(), sort(), vue())
