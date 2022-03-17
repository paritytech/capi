#![allow(non_snake_case)]

use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[cfg(feature = "crypto")]
#[path = "./crypto/mod.rs"]
pub mod crypto;

#[cfg(feature = "scale_fixtures")]
#[path = "./scale/_fixtures.rs"]
pub mod scale_fixtures;

#[cfg(feature = "frame_metadata_fixtures")]
#[path = "./frame_metadata/_fixtures.rs"]
pub mod frame_metadata_fixtures;
