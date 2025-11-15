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
