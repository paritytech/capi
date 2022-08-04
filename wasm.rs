#![allow(non_snake_case)]

use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[cfg(feature = "hashers")]
pub mod hashers;

#[cfg(feature = "ss58")]
pub mod ss58;
