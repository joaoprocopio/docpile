import * as compat from "@eslint/compat";
import prettier_ from "eslint-plugin-prettier/recommended";
import sort_ from "eslint-plugin-simple-import-sort";
import path from "path";
import url from "url";

import withNuxt from "./.nuxt/eslint.config.mjs";

/** @returns {import("eslint").Linter.Config} */
function prettier() {
  return prettier_;
}

/** @returns {import("eslint").Linter.Config} */
function gitignore() {
  const filename = url.fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  const gitignore = path.resolve(dirname, ".gitignore");

  return compat.includeIgnoreFile(gitignore);
}

/** @returns {import("eslint").Linter.Config} */
function sort() {
  return {
    plugins: {
      "simple-import-sort": sort_,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  };
}

const config = withNuxt(gitignore(), prettier(), sort());

export default config;
