#![allow(non_snake_case)]

use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

pub mod sr25519;
pub mod ss58;
pub mod storage_hashers;
