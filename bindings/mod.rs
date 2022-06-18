#![allow(non_snake_case)]

use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[cfg(feature = "hashers")]
pub mod hashers;

#[cfg(feature = "sr25519")]
pub mod sr25519;

#[cfg(feature = "ss58")]
pub mod ss58;

#[cfg(feature = "bip39")]
pub mod bip39;
