use clap::Parser;
use docpie::{ext, runtime};
use sqlx_cli::{Opt, run as run_cli};

fn main() {
    ext::tracing::init();
    let rt = runtime::new();

    ext::dotenvy::from_current_crate().unwrap_or_else(|err| {
        tracing::error!("failed to load .env file: {}", err);
        std::process::exit(1);
    });

    rt.block_on(async { run_cli(Opt::parse()).await })
        .unwrap_or_else(|err| {
            tracing::error!("fatal error occurred: {}", err);
            std::process::exit(1);
        });
}
