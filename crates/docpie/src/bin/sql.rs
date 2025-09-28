use clap::Parser;
use docpie::{ext, runtime};
use sqlx_cli::{Opt, run as run_cli};

fn main() {
    ext::tracing::init();
    let rt = runtime::new();

    if let Err(err) = rt.block_on(async { run_cli(Opt::parse()).await }) {
        tracing::error!("fatal error occurred: {}", err);
        std::process::exit(1);
    };
}
