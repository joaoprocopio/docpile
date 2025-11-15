# docpie

`docpie` is an open-source self-hostable documentation management solution that suits many cases.

## commands

### run docker

```sh
docker compose up -d
```

### migrate

```sh
cargo install sqlx-cli
sqlx migrate run --source './crates/docpie/src/db/migrations'
```

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
