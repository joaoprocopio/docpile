// @ts-check
import * as compat from "@eslint/compat";
import prettier from "eslint-plugin-prettier/recommended";
import sort from "eslint-plugin-simple-import-sort";
import path from "path";
import url from "url";

import withNuxt, { defineFlatConfigs } from "./.nuxt/eslint.config.mjs";

function withGitignore(config) {
  const filename = url.fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const gitignore = path.resolve(dirname, ".gitignore");

  return defineFlatConfigs(config, compat.includeIgnoreFile(gitignore));
}

function withSimpleImportSort(config) {
  return defineFlatConfigs(config, {
    plugins: {
      "simple-import-sort": sort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  });
}

function withPrettier(config) {
  return defineFlatConfigs(config, prettier);
}

export default withSimpleImportSort(withGitignore(withPrettier(withNuxt())));
