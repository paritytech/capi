#![allow(non_snake_case)]

use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[path = "./bindings/mod.rs"]
pub mod bindings;
