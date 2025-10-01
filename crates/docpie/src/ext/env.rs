use std::{env, ffi::OsStr};

pub fn env_var_or_default<K: AsRef<OsStr>>(key: K, default: String) -> String {
    env::var(key).unwrap_or_else(|_| default)
}
