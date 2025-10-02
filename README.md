# docpie

`docpie` is an open-source self-hostable documentation management solution that suits many cases.

## commands

```sh
cargo install sqlx-cli
sqlx migrate run --source './crates/docpie/src/db/migrations'
sqlx migrate run --source './crates/docpie/src/db/seeds' --ignore-missing
```
