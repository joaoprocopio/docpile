# AGENTS

Reference sheet for anyone (human or AI) contributing to `docpie`.

## TL;DR

- Nuxt 4 full-stack application with Nitro API routes and SQLite database.
- Uses `pnpm@10.24.0`, prefer `24` or `lts/krypton`.
- Default local port: `3000` (Nuxt dev server with API).
- Database: SQLite via Drizzle ORM. Migrations managed with `drizzle-kit`.
- Authentication: JWT-based (access + refresh tokens) using `jose`.

## Repository layout

```
docpie/
├── app/                    # Nuxt frontend (pages, components, state)
│   ├── components/         # Vue components
│   ├── layouts/            # Layout components (auth, onboarding, org)
│   ├── lib/                # Frontend libraries (UI kit, cache, router, etc.)
│   ├── middleware/         # Client-side route middleware
│   ├── pages/              # File-based routing pages
│   ├── state/              # Client state management (Vue Query + Zod)
│   └── utils/              # Frontend utilities
├── server/                 # Nitro API backend
│   ├── api/v1/             # API route handlers (versioned)
│   │   ├── auth/           # Auth endpoints (signin, signup, etc.)
│   │   └── orgs/           # Organization endpoints
│   ├── auth/               # Auth domain (services)
│   ├── db/                 # Drizzle ORM schema and client
│   ├── middleware/         # Server middleware (JWT auth)
│   ├── org/                # Org domain (services)
│   └── utils/              # Server utilities (JWT, password, errors)
├── shared/                 # Shared code between client and server
│   ├── auth/               # Auth schemas, types (no barrel files)
│   ├── org/                # Org schemas, types (no barrel files)
│   ├── errors/             # Error codes and types (no barrel files)
│   └── utils/              # Shared utilities (no barrel files)
├── drizzle.config.ts       # Drizzle Kit configuration
├── nuxt.config.ts          # Nuxt configuration
└── package.json            # Dependencies and scripts
```

## Architecture

### Backend (Nitro/H3)

The backend follows a Django-inspired domain structure:

- **`server/db/schema.ts`**: Drizzle ORM schema definitions (tables, indexes)
- **`server/db/client.ts`**: Database client initialization
- **`server/<domain>/services.ts`**: Business logic layer (never access DB directly from routes)
- **`server/api/v1/**/\*.ts`\*\*: HTTP route handlers (thin layer, delegates to services)
- **`server/utils/`**: Cross-cutting utilities (JWT, password hashing, errors)
- **`server/middleware/`**: Global middleware (auth token validation)

**No barrel files**: Import directly from specific files (e.g., `#shared/auth/schemas` not `#shared/auth`).

### Frontend (Nuxt 4)

- Entry points: `app.vue` wires up color-mode + layout shells, while `layouts/*.vue` host app frames (`auth`, `onboarding`, `org`).
- Route-level UX lives in `pages/**` following Nuxt conventions.
- Styling: Tailwind 4 via `lib/tailwind/`.
- Auto-imports are disabled; use explicit imports with `~/` alias.

### Shared Code (`shared/`)

Nuxt 3.14+ `shared/` folder enables code sharing between client and server:

- **`shared/auth/schemas.ts`**: Zod schemas for auth (SignIn, SignUp, User)
- **`shared/auth/types.ts`**: TypeScript interfaces for JWT payloads
- **`shared/org/schemas.ts`**: Zod schemas for orgs (Org, CreateOrg, InviteToken)
- **`shared/org/types.ts`**: TypeScript interfaces for org types
- **`shared/errors/codes.ts`**: Firebase-style error codes (`"auth/email-already-in-use"`)
- **`shared/errors/types.ts`**: TypeScript interfaces for API errors
- Import directly from specific files: `#shared/auth/schemas`, `#shared/org/types`, etc.

**Type naming conventions**:

- Prefix types with `T` (e.g., `TUserInput`, `TUserOutput`)
- Prefix interfaces with `I` (e.g., `IAccessTokenPayload`, `IApiError`)
- Use `z.input` for input types, `z.output` for output types (never use `z.infer`)

### State Management (`app/state/`)

Client-side state uses Vue Query with Zod validation:

- **`services.ts`**: HTTP calls via `useHTTP()`, responses parsed with Zod. Import schemas directly from `#shared/*/schemas`
- **`cache.ts`**: Vue Query definitions (`queryOptions`, `mutationOptions`)
- **`composables.ts`**: Domain-specific Vue composables

### Design System (`app/lib/ui/`)

Locally vendored shadcn-vue components:

- Each component in its own folder with PascalCase `.vue` file
- Uses Reka UI primitives for accessibility
- Variants via `class-variance-authority`
- Tailwind class merging via `cn()` utility

## Authentication

JWT-based authentication with access + refresh tokens:

- **Access Token**: 2-hour expiry, stored in `httpOnly` cookie
- **Refresh Token**: 30-day expiry, stored in `httpOnly`, `secure`, `sameSite=strict` cookie
- **Password Hashing**: Argon2id via `@node-rs/argon2`
- **JWT Library**: `jose` (modern, Web Crypto API)

## Initial setup

```sh
pnpm install              # Install dependencies
pnpm db:push              # Create/update database schema
```

## Environment variables

| Variable            | Default                           | Description                  |
| ------------------- | --------------------------------- | ---------------------------- |
| `DOCPIE_JWT_SECRET` | `dev-secret-change-in-production` | Secret for signing JWTs      |
| `DOCPIE_DB_PATH`    | `docpie.db`                       | Path to SQLite database file |

**Important**: Set a strong `DOCPIE_JWT_SECRET` in production!

## Running locally

```sh
pnpm dev                  # Start Nuxt dev server on http://localhost:3000
```

The API is available at `http://localhost:3000/api/v1/`.

## Database commands

```sh
pnpm db:generate          # Generate migrations from schema changes
pnpm db:migrate           # Run pending migrations
pnpm db:push              # Push schema directly (dev only)
pnpm db:studio            # Open Drizzle Studio (DB browser)
```

## API endpoints

All endpoints are versioned under `/api/v1/`.

### Auth (`/api/v1/auth/`)

| Method | Endpoint           | Auth | Description                 |
| ------ | ------------------ | ---- | --------------------------- |
| GET    | `/v1/auth/whoami`  | No   | Get current user (or null)  |
| POST   | `/v1/auth/signin`  | No   | Sign in with email/password |
| POST   | `/v1/auth/signup`  | No   | Create new account          |
| POST   | `/v1/auth/signout` | Yes  | Sign out (clears cookies)   |
| POST   | `/v1/auth/onboard` | Yes  | Mark user as onboarded      |
| POST   | `/v1/auth/refresh` | No   | Refresh access token        |

### Organizations (`/api/v1/orgs/`)

| Method | Endpoint                             | Auth | Description               |
| ------ | ------------------------------------ | ---- | ------------------------- |
| GET    | `/v1/orgs`                           | Yes  | List user's organizations |
| POST   | `/v1/orgs`                           | Yes  | Create new organization   |
| GET    | `/v1/orgs/:slug/invite-token`        | Yes  | Get invite token          |
| POST   | `/v1/orgs/:slug/invite-token`        | Yes  | Rotate invite token       |
| GET    | `/v1/orgs/:slug/invite-token/:token` | No   | Resolve invite link       |

## Testing & QA

```sh
pnpm lint                 # ESLint
pnpm check                # Prettier check
pnpm typecheck            # TypeScript check
pnpm test                 # Run Vitest tests
```

## Build & release

```sh
pnpm build                # Build for production
pnpm preview              # Preview production build
```

## Coding conventions

- Always use `pnpm`; avoid `npm`/`yarn`.
- Keep TypeScript strict—prefer explicit typings and Zod validators.
- Auto-imports are disabled; use explicit imports with `~/` or `#shared/` aliases.
- Vue components follow existing patterns in `lib/ui/`.
- Server code follows Django-style domain organization.
- Tailwind utilities are auto-sorted via Prettier plugin.
- **No barrel files**: Import from specific files, not index.ts re-exports.
- **Type naming**: Prefix types with `T`, interfaces with `I`.
- **Zod types**: Always use `z.input` and `z.output` separately, never `z.infer`.

## Error format

All API errors follow this format:

```json
{
    "code": "auth/email-already-in-use",
    "message": "The email john@doe.com is already taken.",
    "status": 409
}
```

Error codes are defined in `shared/errors/codes.ts` and follow the pattern `domain/error-name`.

## Troubleshooting

- **Nuxt fails to resolve aliases**: Use `~/` for app code, `#shared/` for shared code.
- **JWT errors**: Ensure `DOCPIE_JWT_SECRET` is set and consistent across restarts.
- **Database issues**: Check `DOCPIE_DB_PATH` and ensure the directory is writable.
- **Type errors with shared code**: Run `pnpm postinstall` to regenerate types.

## Common workflow checklist

1. Pull latest changes.
2. `pnpm install` if dependencies changed.
3. `pnpm db:push` if schema changed.
4. Implement change.
5. Run tests/lints (`pnpm lint test typecheck`).
6. Verify formatting (`pnpm check` or `pnpm format`).
7. Document behavior if necessary.

Keep this file updated whenever tooling, commands, or architecture assumptions change.
