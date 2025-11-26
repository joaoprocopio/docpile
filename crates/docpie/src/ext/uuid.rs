use uuid::{ContextV7, Timestamp, Uuid};

pub fn new_uuid_v7() -> Uuid {
    Uuid::new_v7(Timestamp::now(ContextV7::new()))
}
