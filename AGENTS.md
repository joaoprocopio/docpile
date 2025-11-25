# AGENTS

Reference sheet for anyone (human or AI) contributing to `docpie`.

## TL;DR

-   Monorepo with a Rust backend (`crates/docpie`) and a Nuxt 4 app (`apps/docpie`).
-   Uses `pnpm@10.22.0`, Node 20+ (prefer 22), Rust stable (2024 edition) and PostgreSQL 15+.
-   Default local ports: backend API `8000`, static/www `3000`, Nuxt dev server `5173`, Postgres `5432`.
-   Manage the database with `sqlx` migrations under `crates/docpie/src/db/migrations`.

## Repository layout

-   `crates/docpie`: Axum-based API + static-server binary with `dev`/`prod` feature flags, SQLx for persistence, Tokio runtime, Tower middleware.
-   `apps/docpie`: Nuxt 4 SPA (SSR disabled) with Tailwind, Vue Query/Form/Table, tests via Vitest, linting via ESLint + Prettier + Tailwind plugin.
-   `compose.yaml`: single Postgres 18 service wired to the expected defaults.
-   Root `package.json`: holds shared scripts (`pnpm ci`, `pnpm clean:all`) and pins the package manager.

## Frontend architecture (`apps/docpie/src`)

-   Entry points: `app.vue` wires up color-mode + layout shells, while `layouts/*.vue` host app frames (`app`, `auth`, `onboarding`). Route-level UX lives in `pages/**` following Nuxt conventions (e.g., `org-onboarding-*`, `signin`, `signup`, `home`). Navigation behavior is governed by `router.options.ts` and guards in `middleware/auth.global.ts`.
-   Shared building blocks: `components/**` contains leaf or feature components (e.g., `user-menu`). Cross-cutting helpers live in `utils/**` (formatters, cloning helpers) and `ext/**` (integration glue for color-mode, ProseMirror, router utilities).
-   Styling & theming: Tailwind 4 is configured via `lib/tailwind/tailwind.css`, which defines the full design token palette (OKLCH colors, gradients, radii, typography) and base layer resets. The Tailwind module (`lib/tailwind/module.ts`) registers the CSS and Vite plugin. Auto-imports are disabled in `nuxt.config.ts`; imports must be explicit using the `~/` alias.
-   Supporting libraries under `lib/**`:
    -   `lib/http/clients.ts` exposes `useHTTP()` which wraps `$fetch` with `env.API_URL` and `credentials: "include"`. `lib/http/index.ts` re-exports `ofetch` for direct use.
    -   `lib/cache/**` configures @tanstack/vue-query via a Nuxt module (`module.ts`) with runtime plugins (`runtime/plugins/client.ts`), devtools components, and the strongly-typed `defineCache`/`mutationOptions` utilities used across `state/**`. The cache system replaces the previous query system terminology.
    -   `lib/router`, `lib/const`, and other folders centralize constants and routing metadata so features can reference a single source of truth.

### Design system: `lib/ui` (shadcn-vue kit)

-   `apps/docpie/src/lib/ui` is a locally vendored shadcn-vue derived library. Each component resides in its own folder (`button`, `accordion`, `dialog`, etc.) with a PascalCase `.vue` file plus an `index.ts` that exports the component and variant helpers.
-   Components wrap [Reka UI](https://reka-ui.com/) primitives (`Primitive`, accordions, dialogs, drawers) and share Tailwind class presets powered by `class-variance-authority` + a custom `cn()` utility (`lib/ui/utils.ts`) that stitches `clsx` with a tailored `tailwind-merge` config. This keeps variants/densities consistent with the design tokens defined in `lib/tailwind/tailwind.css`.
-   `module.ts` registers any global CSS required by third-party widgets (currently `vue-sonner`). Import this module from `nuxt.config.ts` via `~/lib/ui/module.ts` so additional vendor styles live with the UI kit.
-   When adding or updating UI primitives:
    1. Generate/port the shadcn-vue component into a new directory, keeping PascalCase filenames.
    2. Reuse `Reka` primitives (or `vaul-vue`, `vue-sonner`, etc.) instead of DOM APIs for accessibility.
    3. Define public variants via `cva` (exported types keep consuming code strongly typed).
    4. Run `pnpm --filter docpie lint` and `pnpm exec prettier --write` on the affected files to maintain consistent ordering and Tailwind utility sorting.

### Global & async state: `state/**`

-   The `apps/docpie/src/state` tree groups everything related to client state, schema validation, and async data fetching. Each domain (currently `auth` and `org`) follows the same pattern:
    -   `schemas.ts`: authoritative Zod schemas + TypeScript types (e.g., `state/auth/schemas.ts` defines `SignIn`, `SignUp`, `User`). All HTTP responses must be parsed through these schemas before leaving the state layer.
    -   `services.ts`: thin wrappers around `useHTTP()` that call the backend REST endpoints and immediately `parse` responses (see `state/auth/services.ts`, `state/org/services.ts`).
    -   `cache.ts`: declarative @tanstack/vue-query definitions built with `defineCache`, `queryOptions`, and `mutationOptions`, ensuring keys stay namespaced per domain. Each domain exports a cache definition (e.g., `authCache`, `orgCache`) with typed keys, queries, and mutations. This folder is the only place that should talk to `vue-query` directly.
    -   Optional `composables.ts`: domain-specific helpers for local persistence or derived state (e.g., `state/org/composables.ts` keeps onboarding invites in storage while validating them with Zod).
-   The Vue Query plugin (`lib/cache/runtime/plugins/client.ts`) instantiates a `QueryClient` with sane defaults (5s stale time, non-throwing errors) and is registered via the cache module. `lib/cache/runtime/components/devtools` exposes a devtools component that wraps `@tanstack/vue-query-devtools`.
-   Consumers (pages/layouts/components) use the exported cache definitions, so they never have to know about endpoints or validation—instead they call `const whoamiQuery = authCache.queries.whoami()` before passing it into `useQuery(whoamiQuery)`.
-   Global state that is not query-driven (e.g., onboarding multi-step buffers, cached invite lists) should either live in `state/<domain>/composables.ts` or leverage `@vueuse/core` helpers alongside Zod refinements to keep stored values valid.

## Prerequisites

1. **Rust**: install `rustup`, toolchain `stable` (edition 2024). Run `rustup default stable`.
2. **Node + pnpm**: install Node ≥ 20.12 (22.x recommended). Enable corepack (`corepack enable`) then `corepack prepare pnpm@10.22.0 --activate`.
3. **SQLx CLI**: `cargo install sqlx-cli`.
4. **Docker (optional but recommended)**: used to spin up Postgres via `docker compose`.

## Initial setup

```sh
pnpm install          # from repo root; installs workspace deps
docker compose up -d
sqlx migrate run --source './crates/docpie/src/db/migrations'
```

## Running the stack locally

1. **Database**: `docker compose up -d` (default credentials `postgres/postgres`, db `postgres`). Override via env vars if needed.
2. **Backend**:
    ```sh
    cargo run -p docpie --features dev
    ```
    - `DOCPIE_ADDR` (default `0.0.0.0:8000`), `DOCPIE_TIMEOUT` (seconds), `DOCPIE_BODY_TIMEOUT`, `DOCPIE_ALLOWED_ORIGINS`.
    - `DOCPIE_WWW_ADDR` controls the static proxy (default `0.0.0.0:3000`); with `dev` feature it forwards to the Nuxt dev server (`DOCPIE_WWW_UPSTREAM_ADDR`, default `localhost:5173`).
3. **Frontend**:
    ```sh
    pnpm --filter docpie dev
    ```
    - HMR runs on `5173`. Configure API base via `apps/docpie/nuxt.config.ts` (`runtimeConfig.public.apiUrl`, default `http://localhost:8000/api`).

## Testing & QA

-   Rust: `cargo test -p docpie`. Add `RUST_LOG=trace` for verbose output.
-   Rust linting: `cargo fmt`, `cargo clippy --all-targets --all-features`.
-   Nuxt/TS lint: `pnpm --filter docpie lint`.
-   Nuxt type check: `pnpm --filter docpie typecheck`.
-   Nuxt unit tests: `pnpm --filter docpie test`.
-   When touching database code, re-run `sqlx migrate run` and ensure the code compiles with `SQLX_OFFLINE` off (or regenerate `sqlx-data.json` if introduced).

## Build & release

-   Backend release binary: `cargo build -p docpie --release --features prod`. Produces `target/release/docpie`.
-   Frontend production bundle: `pnpm --filter docpie build` (generates `.output`). Static assets live under `apps/docpie/.output/public` and are served by the Rust `www` server when compiled with the `prod` feature.
-   Containers/services are not defined yet, but `compose.yaml` can be extended to ship both backend and frontend.

## Coding conventions

-   Always use `pnpm`; avoid `npm`/`yarn`.
-   Keep TypeScript strict (see `apps/docpie/tsconfig*.json`)—prefer explicit typings and `zod` validators for runtime schemas.
-   Vue components live under `apps/docpie/src`. Follow existing foldering (features, lib, ui). Tailwind utilities are auto-sorted via the Prettier Tailwind plugin.
-   Backend modules (`crates/docpie/src`) use `mod` folders (e.g., `http`, `www`, `db`, `ext`, `graceful`). Prefer returning `crate::error::Result` and instrument endpoints with `tracing`.
-   Gate dev-only HTTP client logic behind the `dev` feature (see `www::config`).

## Database guidance

-   Migrations live at `crates/docpie/src/db/migrations/<timestamp>_<name>.sql`. Use `sqlx migrate add <name>` to generate files.
-   Keep SQLx queries in sync with schema; run `SQLX_OFFLINE=false cargo test -p docpie` to re-validate metadata.
-   Connection pooling is handled in `db::create_db_pool`; reuse the pool from `ServerEnv`.

## Troubleshooting tips

-   **`sqlx` compile errors**: ensure the database is reachable and env vars match `DOCPIE_DB_URL`.
-   **Nuxt fails to resolve aliases**: confirm `srcDir` is `src/` and use the `~/` alias; auto-imports are disabled on purpose.
-   **CORS issues**: update `DOCPIE_ALLOWED_ORIGINS` (comma-separated) to include the front-end origin.
-   **Port collisions**: adjust `DOCPIE_ADDR`, `DOCPIE_WWW_ADDR`, or Nuxt `devServer.port` in `nuxt.config.ts`.

## Common workflow checklist

1. Pull latest changes.
2. `pnpm install && cargo fetch` if dependencies changed.
3. Start Postgres + run migrations.
4. Implement change (Rust and/or Nuxt).
5. Run relevant tests/lints (`cargo test`, `pnpm --filter docpie lint test typecheck`).
6. Verify formatting (`cargo fmt`, `pnpm exec prettier --check apps/docpie` if needed).
7. Document behaviour in README or UI if necessary.

Keep this file updated whenever tooling, commands, or architecture assumptions change.
