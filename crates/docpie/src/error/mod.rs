use thiserror::Error;

#[derive(Error, Debug)]
pub struct MyError {
    msg: String,
    #[source] // optional if field name is `source`
    source: anyhow::Error,
}

impl std::fmt::Display for MyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        writeln!(f, "{}", self.msg)?;

        Ok(())
    }
}

// impl serde::Serialize for Error {
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::Serializer,
//     {
//         let mut map = serializer.serialize_map(None)?;

//         map.serialize_entry(&"status", &self.status.as_u16())?;

//         map.end()
//     }
// }
