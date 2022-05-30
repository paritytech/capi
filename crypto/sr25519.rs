use {
  js_sys::Uint8Array, sp_core::Encode, sp_core_hashing::blake2_256, sp_keyring::AccountKeyring,
  wasm_bindgen::prelude::*,
};

#[wasm_bindgen]
pub fn alice_sign(data: &[u8]) -> Uint8Array {
  if data.len() > 256 {
    AccountKeyring::Alice.sign(&blake2_256(&data)[..]).encode()[..].into()
  } else {
    AccountKeyring::Alice.sign(&data).encode()[..].into()
  }
}
