import * as $compat from "@eslint/compat"
import $javascript from "@eslint/js"
import $config from "eslint/config"
import $prettier from "eslint-plugin-prettier/recommended"
import $sort from "eslint-plugin-simple-import-sort"
import $path from "path"
import $typescript from "typescript-eslint"
import $url from "url"

/** @returns {import("eslint").Linter.Config} */
function javascript() {
    return $javascript.configs.recommended
}

/** @returns {import("eslint").Linter.Config} */
function typescript() {
    return $typescript.configs.strict
}

/** @returns {import("eslint").Linter.Config} */
function prettier() {
    return $prettier
}

/** @returns {import("eslint").Linter.Config} */
function gitignore() {
    const filename = $url.fileURLToPath(import.meta.url)
    const dirname = $path.dirname(filename)
    const rootdir = $path.resolve(dirname, "..", "..")
    const gitignore = $path.resolve(rootdir, ".gitignore")

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

export default $config.defineConfig(gitignore(), javascript(), typescript(), prettier(), sort())
