import * as compat from '@eslint/compat'
import sort from 'eslint-plugin-simple-import-sort'
import path from 'path'
import url from 'url'

import withNuxt from './.nuxt/eslint.config.mjs'

/** @returns {import("eslint").Linter.Config} */
function addGitignore() {
  const filename = url.fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)
  const gitignore = path.resolve(dirname, '.gitignore')

  return compat.includeIgnoreFile(gitignore)
}

/** @returns {import("eslint").Linter.Config} */
function addSimpleImportSort() {
  return {
    plugins: {
      'simple-import-sort': sort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  }
}

const config = withNuxt(
  addGitignore(),
  addSimpleImportSort(),
)

export default config
