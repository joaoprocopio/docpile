use clap::Parser;
use docpie::{ext, runtime::new_runtime};
use sqlx_cli::{Opt, run as run_cli};

fn main() {
    ext::tracing::init();
    let runtime = new_runtime();

    if let Err(err) = runtime.block_on(async { run_cli(Opt::parse()).await }) {
        tracing::error!("fatal error occurred: {}", err);
        std::process::exit(1);
    };
}
