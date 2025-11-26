# docpie

`docpie` is an self-hostable documentation management solution that suits many cases.

## commands

### set default .env

```sh
cp .env.example .env
```

### run docker

```sh
docker compose up -d
```

### migrate

```sh
cargo install sqlx-cli
sqlx migrate run --source './crates/docpie/src/db/migrations'
```

> if you want to reset all migrations
> `sqlx migrate revert --source './crates/docpie/src/db/migrations' --target-version 0`

### run the server

```sh
cargo run --features dev
```

### run the frontend

```sh
npm i -g pnpm
pnpm install
pnpm -r dev
```
