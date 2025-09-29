use std::path::Path;

pub fn from_current_crate() -> dotenvy::Result<()> {
    let path = Path::new(env!("CARGO_MANIFEST_DIR"));
    let path = path.join(".env");

    dotenvy::from_path(path)
}
