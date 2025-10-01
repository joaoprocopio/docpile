# docpie

`docpie` is an open-source self-hostable documentation management solution that suits many cases.

## commands

```sh
cargo install sqlx-cli
cargo sqlx prepare --workspace --database-url 'sqlite:./db.sqlite3'
sqlx migrate run --database-url 'sqlite:./db.sqlite3' --source ./crates/docpie/src/db/migrations
```
