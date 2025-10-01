use clap::Parser;
use docpie::ext;
use sqlx_cli::{Opt, maybe_apply_dotenv, run as run_cli};

fn main() {
    ext::tracing::init();
    let rt = ext::tokio::new_runtime();
    maybe_apply_dotenv();

    rt.block_on(async { run_cli(Opt::parse()).await })
        .unwrap_or_else(|err| {
            tracing::error!(?err);
            std::process::exit(1);
        });
}
