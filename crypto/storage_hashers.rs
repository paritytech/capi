use {
  frame_support::{Blake2_128Concat, Identity, StorageHasher, Twox64Concat},
  js_sys::Uint8Array,
  paste::paste,
  sp_core_hashing::{blake2_128 as _blake2_128, blake2_256 as _blake2_256, twox_128, twox_256},
  wasm_bindgen::prelude::*,
};

macro_rules! make_hasher_binding {
  ($n:ident, $e:expr) => {
    paste! {
      #[wasm_bindgen]
      pub fn [<$n>](data: &[u8]) -> Uint8Array {
        console_error_panic_hook::set_once();
        $e(&data)[..].into()
      }
    }
  };
}

make_hasher_binding!(blake2_128, _blake2_128);
make_hasher_binding!(blake2_256, _blake2_256);
make_hasher_binding!(blake2_128Concat, <Blake2_128Concat as StorageHasher>::hash);
make_hasher_binding!(twox128, twox_128);
make_hasher_binding!(twox256, twox_256);
make_hasher_binding!(twox64Concat, <Twox64Concat as StorageHasher>::hash);
make_hasher_binding!(identity, <Identity as StorageHasher>::hash);
